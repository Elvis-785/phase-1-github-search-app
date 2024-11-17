document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#github-form");
    const searchInput = document.querySelector("#search");
    const resultsDiv = document.querySelector("#user-list");
  
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = searchInput.value;
      searchUsers(query);
    });
  
    function searchUsers(query) {
      fetch(`https://api.github.com/search/users?q=${query}`, {
        headers: {
          Accept: "application/vnd.github.v3+json"
        }
      })
      .then(response => response.json())
      .then(data => {
        displayUsers(data.items);
      })
      .catch(error => console.error("Error fetching users:", error));
    }
  
    function displayUsers(users) {
      resultsDiv.innerHTML = "";
      users.forEach(user => {
        const userDiv = document.createElement("div");
        userDiv.innerHTML = `
          <h2>${user.login}</h2>
          <img src="${user.avatar_url}" alt="${user.login}" width="100">
          <a href="${user.html_url}" target="_blank">View Profile</a>
          <button data-username="${user.login}">Show Repos</button>
        `;
        resultsDiv.appendChild(userDiv);
  
        const showReposButton = userDiv.querySelector("button");
        showReposButton.addEventListener("click", () => {
          fetchRepos(user.login);
        });
      });
    }
  
    function fetchRepos(username) {
      fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
          Accept: "application/vnd.github.v3+json"
        }
      })
      .then(response => response.json())
      .then(repos => {
        displayRepos(repos, username);
      })
      .catch(error => console.error("Error fetching repos:", error));
    }
  
    function displayRepos(repos, username) {
      const userDiv = [...resultsDiv.children].find(div => div.querySelector("h2").innerText === username);
      const reposDiv = document.createElement("div");
      reposDiv.innerHTML = `<h3>Repositories:</h3>`;
      repos.forEach(repo => {
        const repoDiv = document.createElement("div");
        repoDiv.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
        reposDiv.appendChild(repoDiv);
      });
      userDiv.appendChild(reposDiv);
    }
  });
  