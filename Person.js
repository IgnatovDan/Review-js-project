/*
класс Person не использует унаследованные от Component свойства/методы.
Можно лучше: не наследовать от Component
Cv https://ru.wikipedia.org/wiki/KISS_(%D0%BF%D1%80%D0%B8%D0%BD%D1%86%D0%B8%D0%BF)
*/
class Person extends Component {
    constructor(name) {
        super();
        this.name = name;
        this._happiness = 0;
        /*
        Свойства _valueElement/_iconElement не используются в коде класса Person
        Можно лучше: хранить эти переменные в коде, который их использует (и почитать про разделение model-view-viewmodel и SOLID)
        См https://ru.wikipedia.org/wiki/SOLID_(%D0%BE%D0%B1%D1%8A%D0%B5%D0%BA%D1%82%D0%BD%D0%BE-%D0%BE%D1%80%D0%B8%D0%B5%D0%BD%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D0%BE%D0%B5_%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5)
        */
        this._valueElement = document.querySelector(`.column__value-name`);
        this._iconElement = document.querySelector(`.column__value-icon`);
    }

    /*
    В названиях функций, которые возвращают значения, использованы разные префиксы: is/has
    Можно лучше: использовать одинаковые префиксы для схожих функций
    */
    /*
    Функции hasCat/hasRest/hasMoney содержат один и тот же код
    Можно лучше: использовать одну функцию вместо нескольких
    См https://ru.wikipedia.org/wiki/Don%E2%80%99t_repeat_yourself
    */
    /*
    Функции hasCat/hasRest/hasMoney возвращают результат, но он не используется.
    Можно лучше: возвращать результат только когда вызывающий код его использует
    См https://ru.wikipedia.org/wiki/YAGNI + https://habr.com/ru/company/itelma/blog/546372/
    */
    hasCat() {
        /*
        Эта функция меняет внутреннее состояние объекта и каждый новый вызов будет возвращать новое значение из-за побочных эффектов каждого вызова.
        Необходимо изменить: функция запроса значения должна возвращать одно и то же значение на нескольких последовательных вызовах.
        Эта ошибка есть в соседних функциях с кодом "this._happiness++".
        См https://ru.hexlet.io/courses/introduction_to_programming/lessons/pure/theory_unit
        */
        return this._happiness++;
    }

    hasRest() {
        return this._happiness++;
    }

    hasMoney() {
        return this._happiness++;
    }

    isSunny() {
        /*
        Это секретный APIKey от api.openweathermap.org для каждого клиента и не должен быть доступен на стороне клиента в браузере.
        Текущий подход позволяет скопировать этот ключ и использовать сервис в неограниченном количестве программ сколько позволит тариф по этому ключу.
        См https://openweathermap.org/appid#apicare
        Необходимо изменить: ключ не должен попадать в браузер, архитектуру приложения нужно изменить так,
        что бы ключ не был доступен на стороне клиента. Нужно добавить серверную часть и сделать ключ доступным только на сервере.
        */
        const APIKey = '28c7d687accc7c75aabbc7fb71173feb';
        const city = 'Москва';
        const url = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + APIKey;

        /*
        Эта функция выполняет запрос данных от удаленного сервера, но по названию она выглядит как синхронная функция
        которая сразу возвращает результат.
        Можно лучше: использовать префикс в названиях таких функций, например 'fetchSunnyValue', что бы по названию функции было понятно
        синхронная она или нет.
        */
        /*
        Эта функция выполняет запрос данных от удаленного сервера, который может быть долгим (несколько минут)
        При этом интерфейс не блокируется и можно ввести новые данные, которые затем будут затерты результатами от старого fetch
        Необходимо исправить: добавить визуальную блокировку интерфейса на время выполнения операции.
        */

        return fetch(url)
            .then(res => res.json())
            .then((res) => {
                console.log(this._happiness);
                /*
                Эта функция возвращает "this._happiness++" только в одной ветке алгоритма,
                хотя вызывающий код "Man.isSunny().then((happiness) => {.." всегда ожидает значение.
                В другой ветке алгоритма (когда условие "ложно") функция возвращает значение undefined.
                Необходимо изменить: функция всегда должна возвращать результат своей работы либо ошибку.
                */

                if (res.main.temp - 273 > 15) {
                    return this._happiness++;
                }
            });
      }
}
