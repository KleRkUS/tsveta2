import FormData from 'form-data'
import axios from 'axios';


const button = document.getElementById('button');

button.onclick = async e => {
  e.preventDefault();
  let data = new FormData(),
    file = e.target.value,
    URL = "/image";
  data.append('file', file  );

  axios.post(URL, data, {
    headers: {
      'accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.8',
    },
    data: {
      image: data
    }
  }).then( res => {
    console.log(res.body);
  }).catch( err => {
    console.log(err);
  });
}