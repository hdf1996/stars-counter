'use strict';
(function () {
  const $container = document.querySelector('.container');
  const $avatar = document.querySelector('.js-avatar');
  const $avatarContainer = $avatar.parentNode;
  const $input = document.querySelector('.js-input');
  const $starsCount = document.querySelector('.js-stars-count');
  let lastTimeout;
  let lastFetch;
  let lastLoading;
  let username = '';
  let loading = true;

  const changeTo = (newUsername) => {


    if(username === newUsername) return;
    username = newUsername
    clearTimeout(lastFetch);
    clearTimeout(lastLoading);
    loading = true;
    $container.classList.remove('fetched')
    const tick = () => {
      if(!loading) return;
      $starsCount.innerHTML += '.';

      if($starsCount.innerHTML.length > 3) $starsCount.innerHTML = '.';
      setTimeout(() => tick(), 300);
    };

    const notFound = async () => {
      $avatarContainer.style.width = 0;
      $avatarContainer.style.height = 0;
      $container.classList.add('fetched')
      loading = false;
      $starsCount.innerHTML = `User not found`;
    }

    lastLoading = setTimeout(() => tick(), 300);
    lastFetch = fetch(`https://crossorig.in/https://stars-counter-api.herokuapp.com/stars/${username}`)
                  .then(res => (res.status === 200) ? res.json() : notFound())
                  .then((res) => {
                    if(!res) return;
                    $avatarContainer.style.width = "33vh";
                    $avatarContainer.style.height = "33vh";
                    $avatar.src = res.avatar;
                    $starsCount.innerHTML = `${res.total} ⭐`;
                    $container.classList.add('fetched')
                    loading = false;
                  })
                  .catch(res => notFound());
  }

  const onChange = e => {
    const value = e.target.value;
    if(lastTimeout) clearTimeout(lastTimeout);
    lastTimeout = setTimeout(() => {
      changeTo(value)
    }, 1000)
  };

  $input.addEventListener('keyup', onChange)
  changeTo('torvalds')
})()
