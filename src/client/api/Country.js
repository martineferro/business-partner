import ApiBase from './ApiBase';

class Country extends ApiBase {
  getCountry(countryId, locale = 'en') {
    return this.ajax.get(`/isodata/api/countries/${countryId}`).set('Accept', 'application/json').
      set('Accept-Language', locale).then(response => response.body.name || response.body.id);
  }
}

export default Country;
