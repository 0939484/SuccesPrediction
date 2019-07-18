const roles = ["Backend operator", "Project manager", "Project member"];
const nonMutableQuestions = ["Implementation"];
const secret = 'z5mgTLn3H2';
const publicKey = 'BCzIzo5U_3RwdeS8eGb7XnMLWxAOKZOh8K-V45bkOeTUQf62tQ6eyMKfBOa5qaz5wqbCpgIK0F-eyokW3lFwJfc' || process.env.VAPID_PUBLIC_KEY;
const privateKey = '7415QgWSWvoq4ApYlpLpgLBHvbOCtKrLaHmf24PSEs4' || process.env.VAPID_PRIVATE_KEY;

module.exports = {
    roles, nonMutableQuestions, secret,
};