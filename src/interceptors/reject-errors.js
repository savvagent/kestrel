import { isJson } from '../utils';


const rejectErrors = {
  response(response) {
    if (isJson(response)) return response;
    if (!response.ok) throw response;
    return response;
  },
  id: 'KESTREL_REJECT_ERRORS'
};

export default rejectErrors;
