const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;
const NEWS_API_KEY = process.env.NEWS_API_KEY;

app.get('/', async (req, res) => {
  const { country = '', q = '', topic = '' } = req.query;

  try {
    const response = await axios.get('https://gnews.io/api/v4/top-headlines', {
      params: {
        token: NEWS_API_KEY,
        lang: 'en',
        country: country,
        q: q,
        topic: topic,
        max: 5
      }
    });

    const articles = response.data.articles;

    let html = `
      <form method="GET" style="margin-bottom: 20px;">
        <label>Country (2-letter code): <input name="country" value="${country}"></label>
        <label>Topic: <input name="topic" value="${topic}"></label>
        <label>Keyword: <input name="q" value="${q}"></label>
        <button type="submit">Search</button>
      </form>
      <h1>Top News Articles</h1>
    `;

    if (!articles || articles.length === 0) {
      html += `<p>No articles found for your query.</p>`;
    } else {
      html += `<ul>`;
      articles.forEach(article => {
        html += `
          <li style="margin-bottom: 15px;">
            <h3>${article.title}</h3>
            <p>${article.description || 'No description available.'}</p>
            <a href="${article.url}" target="_blank">Read more</a>
          </li>
        `;
      });
      html += `</ul>`;
    }

    res.send(html);

  } catch (error) {
    console.error('GNews API Error:', error.response?.data || error.message);
    res.status(500).send('Error fetching news articles. Please check your API key or try again.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
