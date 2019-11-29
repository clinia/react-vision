import cliniasearch from 'cliniasearch/lite';

const searchClient = cliniasearch('TODO', 'AAW3nfvI79tj4LzECYZSEbDP7lqBpFd5', {
  hosts: {
    read: ['api.partner.staging.clinia.ca'],
    write: ['api.partner.staging.clinia.ca'],
  },
});

export default searchClient;
