import React, { Component } from 'react';
import api from '../../services/api';

// import { Container } from './styles';

class Repository extends Component {
  state = {
    repository: {},
    issues: [],
    loading: true,
  };


  async componentDidMount() {
    const { match } = this.props;

    const repoName = decodeURIComponent(match.params.repository);

    const response = await api.get(`/repos/${repoName}`);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      respository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  render() {
    const { repository, issues, loading } = this.state;

    return <h1>Repository</h1>;
  }
}

export default Repository;
