module.exports = [
  'strapi::errors',
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:3000'],  // adres, pod którym działa frontend
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization'],
    },
  },
  'strapi::security',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
