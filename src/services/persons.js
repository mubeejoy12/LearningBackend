import axios from "axios";

const baseUrl = import.meta.env.PROD
  ? import.meta.env.VITE_BACKEND_URL
  : "http://localhost:3003/api/persons";

const getAll = () => axios.get(baseUrl).then((res) => res.data);
const create = (newPerson) =>
  axios.post(baseUrl, newPerson).then((res) => res.data);
const update = (id, updatedPerson) =>
  axios.put(`${baseUrl}/${id}`, updatedPerson).then((res) => res.data);
const remove = (id) => axios.delete(`${baseUrl}/${id}`);

export default { getAll, create, update, remove };
