/**
 * API Configuration
 * Contains all API endpoints and configuration values
 */
export const API_CONFIG = {
  BASE_URL: 'https://67fbd85e1f8b41c816850dc0.mockapi.io',
  ENDPOINTS: {
    CONTACTS: '/contacts'
  },
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json'
  },
  REQUEST_TIMEOUT: 30000, // 30 seconds

  // Fallback data for development and testing
  SAMPLE_CONTACTS: [
    {
      "id": "1",
      "firstName": "Katrina",
      "lastName": "Larkin",
      "jobTitle": "Software Engineer",
      "profileImage": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/85.jpg",
      "bio": "Passionate about building scalable web applications and learning new technologies.",
      "email": [
        {
          "address": "katrina.larkin@example.com",
          "type": "work"
        }
      ],
      "phone": [
        {
          "number": "+1-555-0101",
          "type": "mobile"
        }
      ],
      "meeting": "http://go.betacall.com/meet/k.larkin",
      "social": {
        "linkedin": "linkedin.com/in/katrinalarkin",
        "twitter": "twitter.com/katrinalarkin"
      },
      "status": "online"
    },
    {
      "id": "2",
      "firstName": "Ellen",
      "lastName": "Gusikowski",
      "jobTitle": "Data Scientist",
      "profileImage": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/female/512/19.jpg",
      "bio": "Expert in machine learning and statistical analysis with a PhD in Computer Science.",
      "email": [
        {
          "address": "ellen.gusikowski@example.com",
          "type": "work"
        }
      ],
      "phone": [
        {
          "number": "+1-555-0202",
          "type": "mobile"
        }
      ],
      "meeting": "http://go.betacall.com/meet/e.gusikowski",
      "social": {
        "linkedin": "linkedin.com/in/ellengusikowski",
        "twitter": "twitter.com/ellengusikowski"
      },
      "status": "away"
    }
  ]
};
