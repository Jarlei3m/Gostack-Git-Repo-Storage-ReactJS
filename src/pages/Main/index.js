import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';

import Container from '../components/Container';
import { Form, SubmitButton, List, InputField, SmallMessage } from './styles';

class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
    notFound: false,
    message: '',
  };

  // get datas from localStorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');

    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) })
    }

  }

  // Save localStorage datas
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;

    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value })
  }

  handleSubmit = async e => {
    try {
      e.preventDefault();

      this.setState({ loading: true });

      const { newRepo, repositories } = this.state;

      // check duplicated repo
      const duplicatedRepo = repositories.filter(repository => repository.name === newRepo)

      if (duplicatedRepo.length === 0) {
        const response = await api.get(`/repos/${newRepo}`);
        const data = {
          name: response.data.full_name,
        };

        this.setState({
          repositories: [ ...repositories, data],
          newRepo: '',
          loading: false,
          notFound: false,
          message: 'successfully added!',
        })

        setTimeout(() => this.setState({ message: ''}), 3000);

      } else {
        throw new Error('Duplicated Repo')
      }

    } catch (error) {
      console.log(error)
      this.setState({
        loading: false,
        notFound: true,
        message: 'invalid input!',
      })

      setTimeout(() => this.setState({ message: '' }), 3000);

    }
  };


  render() {
    const { newRepo, loading, repositories, notFound, message } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Respository
        </h1>

        <Form onSubmit={this.handleSubmit}>
          <InputField
            value={newRepo}
            onChange={this.handleInputChange}
            notFound={notFound}
          />

          <SmallMessage notFound={notFound}>
            { message }
          </SmallMessage>

          <SubmitButton loading={loading}>
            { loading ?
              <FaSpinner color='#fff' size={14} />
              :
              <FaPlus color='#fff' size={14} />
            }

          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repository => (
            <li key={repository.name}>
              <span>{repository.name}</span>
              <Link to={`/repository/${encodeURIComponent(repository.name)}`}>Details</Link>
            </li>
          ) )}
        </List>
      </Container>
    );
  }
}

export default Main;
