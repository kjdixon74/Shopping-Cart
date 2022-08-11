module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '4cdb9e312ddb4e49dc54f8c9bf8133f1'),
  },
});
