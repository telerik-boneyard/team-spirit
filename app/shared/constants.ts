export const appId = '35ylfmbdmpzbqn0c';
export const disabledDawerRoutes = [
    new RegExp('^/user/login', 'i'),
    new RegExp('^/((events)|(groups)|(user))/.+', 'i')
];

export const androidProjNumber = '246590852129';

export const modalsTimeout = 3000;

export const extendedLoadingThreshold = 1500;

export const imageWidth = 400;

export const systemErrorMsgs = {
    'Iterator timed out': 'The operation took too long. Please try again later.',
    'Invalid request body': 'Something out of the ordinary happened. Please excuse us.',
    'Invalid username or': 'Invalid e-mail or password.',
    'java.net.UnknownHostException': 'Could not reach server. Please check your internet connection',
    'The operation results in a duplicate key': 'The name you chose is already taken. Please choose another one'
};
