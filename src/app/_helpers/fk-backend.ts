import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {
    const now = new Date();
    let moth = now.getMonth() + 1;
    let today = now.getDate()+'/'+ moth +'/'+now.getFullYear();
    let dataBase: any[] = JSON.parse(localStorage.getItem('dataBase')) || [];

    //configure
    backend.connections.subscribe((connection: MockConnection) => {
        setTimeout(() => {        
            //autenticar
            if (connection.request.url.endsWith('/api/authenticate') && connection.request.method === RequestMethod.Post) {
                let params = JSON.parse(connection.request.getBody());
                
                let filteredDataBase = dataBase.filter(dataBase => {
                    return dataBase.username === params.username && dataBase.password === params.password;
                });
                if (filteredDataBase.length) {                    
                    //if return 200 com detalhes usuario e o token 
                    let dataBase = filteredDataBase[0];
                    connection.mockRespond(new Response(new ResponseOptions({
                        status: 200,
                        body: {  
                            id: dataBase.id, 
                            fullname: dataBase.fullname,                         
                            username: dataBase.username,
                            password: dataBase.password,                         
                            token: 'fake-jwt-token'
                        }
                    })));
                } else {
                    // else return 400 bad request
                    connection.mockError(new Error('Usuário não encontrado.'));
                    
                }
                return;
            }

            // get users
            if (connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Get) {                 
                if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {                   
                   let matchedUsers = dataBase.filter(dataBase => {return dataBase.category === 'users'});
                    connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: matchedUsers })));
                } else {                
                    connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                }
                return;
            }

            // get commitment
            if (connection.request.url.endsWith('/api/commitment') && connection.request.method === RequestMethod.Get) {                 
                if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') { 
                   let currentUser = JSON.parse(localStorage.getItem('currentUser'));    
                   let matchedCommitment = dataBase.filter(dataBase => {return dataBase.category === 'commitment'});                   
                   let dbCommitment = matchedCommitment.filter(matchedCommitment => {return matchedCommitment.username === currentUser.fullname});

                   connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: dbCommitment })));
                } else {                   
                   connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                }
                return;
            }
           
            // get user by id
            if (connection.request.url.match(/\/api\/users\/\d+$/) && connection.request.method === RequestMethod.Get) {
                //Verifica o token de autenticação 
                if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                
                    let urlParts = connection.request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    let matchedUsers = dataBase.filter(dataBase => { return dataBase.id === id; });
                    let user = matchedUsers.length ? matchedUsers[0] : null;

                    // respond 200 OK
                    connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: user })));
                } else {
                    // return 401 não autorizado
                    connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));               
                }
                return;
            }

            // create user
            if (connection.request.url.endsWith('/api/users') && connection.request.method === RequestMethod.Post) {
                // get novo user
                let newUser = JSON.parse(connection.request.getBody());

                // validação
                let duplicateUser = dataBase.filter(dataBase => { return dataBase.username === newUser.username; }).length;
                if (duplicateUser) {            
                    return connection.mockError(new Error('Username "' + newUser.username + '" já cadastrado.'));
                }

                // salva novo usuario
                newUser.id = dataBase.length + 1;
                dataBase.push(newUser);
                localStorage.setItem('dataBase', JSON.stringify(dataBase));

                // respond 200 OK
                connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));

                return;
            }

            // create commitment
            if (connection.request.url.endsWith('/api/commitment') && connection.request.method === RequestMethod.Post) {
              
                let newCommitment = JSON.parse(connection.request.getBody());
                let smallerDate = false;

                if(newCommitment.year < now.getFullYear() || 
                   newCommitment.month < moth && newCommitment.year <= now.getFullYear() ||
                   newCommitment.day < now.getDate() && newCommitment.month <= moth && newCommitment.year <= now.getFullYear() ){
                     smallerDate = true;
                }

                // validação
                let duplicateCommitment = dataBase.filter(dataBase => {
                                                          return dataBase.username === newCommitment.username && 
                                                          dataBase.date === newCommitment.date; }).length;
              
                if (duplicateCommitment) {            
                    return connection.mockError(new Error( '"Colisão de datas. Não é possivel finalizar o agendamento.'));
                }

                if(smallerDate){  
                    return connection.mockError(new Error( '"Não foi possível fazer o agendamento. Data do agendamento é menor do que a data atual.'));
                }

                // salva compromisso
                newCommitment.id = dataBase.length + 1;
                dataBase.push(newCommitment);
            
                localStorage.setItem('dataBase', JSON.stringify(dataBase));
           
                // respond 200 OK
                connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));

                return;
            }

            // edit commitment
             if (connection.request.url.match(/\/api\/editCommitment\/\d+$/) && connection.request.method === RequestMethod.Put) {
                 //Verifica o token de autenticação 
                if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    let editCommitment = JSON.parse(connection.request.getBody());
                    let urlParts = connection.request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    for (let i = 0; i < dataBase.length; i++) {
                        let user = dataBase[i];
                        if (user.id === id) {
                            //edita commitment
                            dataBase.splice(i, 1);
                            dataBase.push(editCommitment);
                            localStorage.setItem('dataBase', JSON.stringify(dataBase));
                            break;
                        }
                    }
                }
             }

             // delete user
            if (connection.request.url.match(/\/api\/users\/\d+$/) && connection.request.method === RequestMethod.Delete) {
                 //Verifica o token de autenticação 
                if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
             
                    let urlParts = connection.request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    for (let i = 0; i < dataBase.length; i++) {
                        let user = dataBase[i];
                        if (user.id === id) {
                            // delete user
                            dataBase.splice(i, 1);
                            localStorage.setItem('dataBase', JSON.stringify(dataBase));
                            break;
                        }
                    }

                    // respond 200 OK
                    connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
                } else {
                    // return 401 não autorizado
                    connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                }
                return;
            }

            // delete commitment
            if (connection.request.url.match(/\/api\/commitment\/\d+$/) && connection.request.method === RequestMethod.Delete) {
                
                if (connection.request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
             
                    let urlParts = connection.request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                  
                    for (let i = 0; i < dataBase.length; i++) {
                        let commitment = dataBase[i];
                        if (commitment.id === id) {
                            // delete commitment
                            dataBase.splice(i, 1);
                            localStorage.setItem('dataBase', JSON.stringify(dataBase));
                            break;
                        }
                    }                 

                    // respond 200 OK
                    connection.mockRespond(new Response(new ResponseOptions({ status: 200 })));
                } else {
                    // return 401 não autorizado
                    connection.mockRespond(new Response(new ResponseOptions({ status: 401 })));
                }
                return;
            }
         
            let realHttp = new Http(realBackend, options);
            let requestOptions = new RequestOptions({
                method: connection.request.method,
                headers: connection.request.headers,
                body: connection.request.getBody(),
                url: connection.request.url,
                withCredentials: connection.request.withCredentials,
                responseType: connection.request.responseType
            });
            realHttp.request(connection.request.url, requestOptions)
                    .subscribe((response: Response) => {
                        connection.mockRespond(response);
            },
            (error: any) => {
                    connection.mockError(error);
            });

        }, 500);
    });
     return new Http(backend, options);
};

export let fakeBackendProvider = {
    provide: Http,
    useFactory: fakeBackendFactory,
    deps: [MockBackend, BaseRequestOptions, XHRBackend]
};