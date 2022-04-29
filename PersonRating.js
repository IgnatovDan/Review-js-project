class PersonRating extends Component {
  constructor(data) {
    super(data);
    /*
    Свойства _names/_ratings хранят одно имя/рейтинг, но их название в множественном числе.
    Лучше сделать их названия в единственном числе что бы по названию свойства было понятно что свойство хранит единственное значение
    См https://learn.javascript.ru/ninja-code
    */
    this._names = data.names;
    this._ratings = data.ratings;
  }
  get template() {
    return `
      <article class="columns__rating-item">
        <h3 class="columns__rating-title">${this._names}</h3>
        <span class="columns__rating-count">${this._ratings}</span>
      </article>`.trim();
  }
}
