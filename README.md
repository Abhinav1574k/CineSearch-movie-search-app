# 🎬 CineSearch - Movie Search App

A responsive movie search application built as part of **Veda Technology Web Development Internship - Task 3**.

The application allows users to search for movies, browse search results, and view detailed information about individual movies using the OMDb API.

---

## 🚀 Live Demo

**Live Website:**  
https://abhinav1574k.github.io/CineSearch-movie-search-app

**GitHub Repository:**  
https://github.com/Abhinav1574k/CineSearch-movie-search-app

---

## 📌 Project Overview

CineSearch is a frontend movie search application designed to practice working with external APIs and dynamic user interfaces.

The application retrieves movie information from the OMDb API and displays the results in a responsive card-based layout.

Users can:

- Search for movies
- View movie posters
- View movie titles and release years
- Open detailed movie information
- View ratings
- View genres, directors and actors
- Read movie plots
- Handle missing posters
- Receive loading and error feedback

---

## 🎯 Task Objective

The objective of this task was to practice:

- API integration
- Search functionality
- Debouncing
- Dynamic rendering
- Client-side caching
- Detail views
- Error handling
- Responsive UI development

---

## ✨ Features

### 🔎 Movie Search

Users can search for movies using the search input.

The application sends the search query to the OMDb API and displays matching movies.

### ⏱️ Debounced Search

Search requests are debounced by 500 milliseconds.

This prevents an API request from being sent for every keystroke.

### 💾 Local Caching

Recently searched movie queries are stored using `localStorage`.

Cached results remain available for 30 minutes.

This reduces unnecessary API requests when the same search is repeated.

### 🎬 Movie Cards

Search results are displayed as responsive movie cards containing:

- Poster
- Title
- Release year
- Movie type
- View Details button

### 📖 Movie Details

Users can select a movie and view:

- Title
- Release year
- Release date
- Genre
- Director
- Actors
- Runtime
- IMDb rating
- Plot

### 🖼️ Missing Poster Handling

If a movie does not have a poster available, the application displays a placeholder image instead.

### ⏳ Loading State

A loading indicator is displayed while API requests are being processed.

### ⚠️ Error Handling

The application provides user-friendly feedback when:

- A search returns no results
- The API request fails
- Movie details cannot be retrieved

### 📱 Responsive Design

The interface adapts to:

- Desktop
- Tablet
- Mobile

---

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- Fetch API
- LocalStorage
- OMDb API
- Git
- GitHub
- GitHub Actions
- GitHub Pages

---

## 🔌 API Integration

This project uses the OMDb API to retrieve movie information.

Two main API operations are used.

### Movie Search

The application searches movies using:

```text
s=movie_name