import connection from '../bin/connectionMySql';

function query(query: string, variables:Array<any>) {
    return new Promise((resolve, reject) => {
        connection.query(query, variables, (error, result) => {
            if (error) {
                return reject(error);
            }
            else {
                return resolve(result);
            }
        })
    })
}

export default query;