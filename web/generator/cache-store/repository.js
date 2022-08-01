export default class Repository {
  constructor(connection) {
    this.connection = connection;
  }

  execute(query, params) {
    const preparedQuery = this.connection.prepareQuery(query);
    try {
      preparedQuery.execute(params);
    } finally {
      preparedQuery.finalize();
    }
  }

  oneEntry(query, params) {
    const preparedQuery = this.connection.prepareQuery(query);
    try {
      const result = preparedQuery.oneEntry(params);
      return result;
    } finally {
      preparedQuery.finalize();
    }
  }

  allEntries(query, params) {
    const preparedQuery = this.connection.prepareQuery(query);
    try {
      const result = preparedQuery.allEntries(params);
      return result;
    } finally {
      preparedQuery.finalize();
    }
  }

  addEntry(query, params) {
    const preparedQuery = this.connection.prepareQuery(query);
    try {
      preparedQuery.execute(params);
      const entryId = this.connection.lastInsertRowId;
      return entryId;
    } finally {
      preparedQuery.finalize();
    }
  }
}
