// search controls
const search_query_input = document.querySelector('.search-query');
const search_sort_select = document.querySelectorAll('.search-sort input');
const search_update_button = document.querySelector('.search-update');

// if search options not changed, don't activate them
let query_changed = false, sort_changed = false;
const update_search = () => {
  const sort_fn = (document.querySelector('.search-sort input:checked')
                  ||{}).value;
  
  const url_queries = [];
  query_changed && url_queries.push(`query=${search_query_input.value}`);
  sort_changed && url_queries.push(`sort=${sort_fn}`);
  const search_url = `/api/search?${url_queries.join('&')}`;
  
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', res => {
    if(xhr.status == 200) {
      gallery_div.innerHTML = xhr.response.idata.map(idatum =>
        `<a class='gallery-art no-underline' href='/peruse/${idatum.perma}'>
        <div class='bgimg' data-bgimg='/art/${idatum.filename}'
         title='${idatum.title}'></div></a>` 
      ).join('');
      lazy_load_images();
    }
  });
  xhr.responseType = 'json';
  xhr.open('GET', search_url);
  xhr.send();
};
search_query_input.addEventListener('keydown', ()=>query_changed=true);
search_sort_select.forEach(search_sort_radio =>
  search_sort_radio.addEventListener('change', ()=>sort_changed=true));
search_update_button.addEventListener('click', update_search);
