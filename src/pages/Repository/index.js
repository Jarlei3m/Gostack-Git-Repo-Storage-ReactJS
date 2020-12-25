import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FaSpinner } from 'react-icons/fa'
import api from '../../services/api';

import Container from '../components/Container';
import { Loading, Owner, IssueList, FilterState } from './styles';

class Repository extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    issueState: 'all',
    loading: true,
  };

  async componentDidMount() {
    const { match } = this.props;
    const { issueState } = this.state;

    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: `${issueState}`,
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  handleStateChange = e => {
    this.setState({
      issueState: e.target.value
    })
  }

  async componentDidUpdate(_, prevState) {
    const { issueState } = this.state;
    console.log(prevState)

    if ( prevState.issueState !== issueState ) {
      const { match } = this.props;
      const repoName = decodeURIComponent(match.params.repository);

      const [issues] = await Promise.all([
        api.get(`/repos/${repoName}/issues`, {
          params: {
            state: `${issueState}`,
            per_page: 5,
          },
        }),
      ]);

      this.setState({
        issues: issues.data,
      });
    }
  }

  render() {
    const { repository, issues, loading } = this.state;

    if (loading) {
      return (
      <Loading>
        <FaSpinner />
      </Loading>
    )}

    return (
      <Container>
        <Owner>
          <Link to="/">Return to repositories</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <label htmlFor="states">Select issue state:</label>
        <FilterState id="states" onChange={this.handleStateChange}>
            <option value="all">all</option>
            <option value="open">open</option>
            <option value="closed">closed</option>
        </FilterState>

        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login}/>
              <div>
                <strong>
                  <a target="_blank" href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
      </Container>
    );
  }
}

export default Repository;
