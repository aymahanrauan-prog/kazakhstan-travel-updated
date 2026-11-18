# Kazakhstan Travel

Multi-page responsive travel website about Kazakhstan (HTML, CSS, Bootstrap 5, JavaScript).

## Pages (9)

| Page | File |
|---|---|
| Home (hero search, popular tours and places, country facts API) | `index.html` |
| Destinations (search, region filter, weather API, saved places) | `destinations.html` |
| Tours (filters, load more, star rating, saved tours, FAQ) | `tours.html` |
| Culture (learn more, random fact, gallery) | `culture.html` |
| About us (mission, guides, team) | `about.html` |
| Contacts (validated form, copy e-mail) | `contact.html` |
| Sign up (3-step form) | `register.html` |
| Log in | `login.html` |
| Profile (user details, saved items, requests) | `profile.html` |

## Features

| Feature | Files |
|---|---|
| Responsive layout (Bootstrap grid + Flexbox) | `css/style.css` |
| Light / Dark mode toggle, saved in localStorage | `js/theme.js`, `css/style.css` |
| Sign up / Log in simulation with localStorage | `js/auth.js`, `js/validation.js` |
| Form validation (email, phone, password complexity, required fields) | `js/validation.js`, `js/multistep.js` |
| Search and filters, last search saved in localStorage | `js/destinations.js`, `js/tours.js` |
| Saved tours and places (heart button) | `js/favorites.js`, `js/profile.js` |
| External APIs: REST Countries, Open-Meteo | `js/api.js` |
| Animations: hover effects, scroll reveal, back-to-top | `css/style.css`, `js/main.js` |

## Project structure

```
index.html, destinations.html, tours.html, ...   pages (flat, for simple hosting)
css/style.css                                     single stylesheet
js/                                               one script per feature
images/                                           lowercase kebab-case names (case-safe on Linux hosting)
```

## Notes

- No backend: users, saved items and requests live in the browser's localStorage.
- Passwords are stored as plain text only because this is a simulation for the course.
- Open `index.html` in a browser, or host the folder on GitHub Pages / Netlify.
