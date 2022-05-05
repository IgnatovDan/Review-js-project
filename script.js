/*
В файле используются разные отступы: 2 или 4 пробела.
Это мешает в совместной работе и появляются изменения "только для форматирования"
Можно лучше: сделать автоматическое форматирование документов при сохранении.
См https://stackoverflow.com/questions/39494277/how-do-you-format-code-on-save-in-vs-code
+ https://www.robinwieruch.de/how-to-use-prettier-vscode
*/
window.onload = () => {
    const FORM_WRAPPER = document.querySelector(`.column_type_input`);
    const ratingArray = [];
    let countedRating = 20;

  /*
  renderSearch/ratingRender/renderForm - похожие функции создания DOM элементов, но структура названий разная
  Можно лучше: сделать одниковую структуру названий, например renderSearch/renderRating/renderForm
  */
    const renderSearch = (allItemsData) => {
      PageEnum.SiteWrapper.SEARCH.innerHTML = ``;

      const searchComponent = new Search();

      PageEnum.SiteWrapper.SEARCH.appendChild(searchComponent.render());

      searchComponent.onChange = (value) => {
        const filteredItems = allItemsData.filter((currentItem) => currentItem._names.includes(value));
        PageEnum.SiteWrapper.rating.innerHTML = ``;
        value === `` ? ratingRender(countedRating, allItemsData) : ratingUpdate(filteredItems);
      };
    };

    const ratingRender = (ratingAmount, ratingArray) => {
      for (let i = 0; i < ratingAmount; i++) {
        /*
        Функция изменяет переданный параметр, это побочный эффект от вызова функции.
        Можно лучше: вынести создание и заполнение массива в отдельную функцию.
        См https://ru.hexlet.io/courses/introduction_to_programming/lessons/pure/theory_unit
        */
        ratingArray[i] = new PersonRating(returnRandomData());
      }
      ratingUpdate(ratingArray);
    };

    const ratingUpdate = (ratingArray) => {
      ratingArray.forEach((item) => {
        /*
        Используется глобальная константа, это затрудняет понимание логики работы кода
        Можно лучше: передать значения в функцию через явные аргументы
        См https://stackoverflow.com/questions/2613310
        */
        PageEnum.SiteWrapper.rating.appendChild(item.render());
      });
      if (ratingArray.length === 0) {
        PageEnum.SiteWrapper.rating.innerHTML = `Rating list is empty`;
      }
    };

    const renderForm = () => {
      const formComponent = new Form();
      /*
      Используется глобальная константа, это затрудняет понимание логики работы кода
      Можно лучше: передать значения в функцию через явные аргументы
      См https://stackoverflow.com/questions/2613310
      */
      FORM_WRAPPER.appendChild(formComponent.render());

      formComponent.onSubmit = (evt) => {
        /*
        Отлично: прерывается всплытие события
        */
        evt.preventDefault();
        const name = document.querySelector(`input[name=name]`).value;
        /*
        Необходимо изменить: алгоритм вычисления не получает значения элементов радиогруппы, потому что выражение с селектором 
        "document.querySelector(`input[name=cat]`).value" возвращает несколько DOM элементов (в соседних вызовах querySelector тоже есть эта ошибка)
        Рекомендую проверять работу сайта на нескольких комбинациях значений для инпутов: заранее посчитать для них результат 
        и проверить, что сайт покажет то же самое значение
        */
        const cat = document.querySelector(`input[name=cat]`).value;
        const rest = document.querySelector(`input[name=rest]`).value;
        const money = document.querySelector(`input[name=money]`).value;
        /*
        Отлично: на каждый коммит формы создается новый объект для выполнения всех вычислений по введенным данным
        */
        const Man = new Person(name);

        console.log(`name - ${name} | cat - ${cat} | rest - ${rest} | money - ${money}`);
        if (cat === 'yes') {
          Man.hasCat();
        }
        if (rest === 'yes') {
          Man.hasRest();
        }
        if (money === 'yes') {
          Man.hasMoney();
        }

        Man.isSunny().then((happiness) => {
          /*
          Этот код преобразует значение 'happiness' в визуальную картинку
          Можно лучше: вынести этот код в отдельную функцию и расположить ее в файле utils.js
          */
          console.log('happiness ' + happiness);
          Man._valueElement.innerHTML = name;
          if (happiness === 4) {
            Man._iconElement.innerHTML = '😆';
          } else if (happiness === 3 || happiness === 2) {
            Man._iconElement.innerHTML = '😐';
          } else {
            Man._iconElement.innerHTML = '☹️';
          }
        });
      };
    };

  /*
  Отлично: есть разделение функций рендера по областям данных: рейтинги, едиторы, показ рейтинга
  */
    renderForm();
    renderSearch(ratingArray);
    ratingRender(countedRating, ratingArray);
};

/*

*******************************            
*** Общий итог ***

    - Что было сделано отлично
      - сделана глобальная разметка для областей рейтингов, ввода значений и показа нового рейтинга
        - сделан готовый базовый класс для рендера контента через темплейт, компоненты от него унаследованы
        - использована довольно сложная функция fetch, есть обращение к удаленному ресурсу и сделан код для обработки результата
        - сделана файловая структура для размещения утилитных функций
        - сделаны классы и использовано наследование и полиморфизм

    - Что можно сделать лучше
      - Структура свойств в классах может больше соответствовать модели MVVM и хранить только данные.
            Код можно более явно разделить код на View и Model части.
            См https://blog.webf.zone/contemporary-front-end-architectures-fb5b500b0231

    - Необходимо исправить:
        - Не работает функционал по описанию readme.md: ввод данных, вычисление рейтинга по введенным данным,
            поиск по имени в списке рейтингов.
            Эти сценарии обязательно надо проверять на сайте в браузере, ведь это именно то, что просит сделать заказчик.
            Если эти сценарии работают правильно, то заказчик одобрит внешнюю работу сайта и перейдет к оценке внутренней реализации.

  - Заключение: в коде продемонстрирована работа с разметкой, с наследованием и ООП, с асинхронными алгоритмами и fetch,
      есть динамическое построение DOM, начато структурирование файлов по назначению кода,
      но работа не может быть принята из-за критических проблем в заказанном функционале.

  - Дальнейший разбор проблем в коде возможен, но я решил остановиться на текущем варианте ревью,
      которое фокусировует усилия на "должно работать", потому что на глаз уже пора синхронизировать
      видение конечного ревью: я уже могу начать делать не такое ревью, которое нужно сделать.

*******************************            
*** Детали по сценариям readme.md ***

* "Ввести необходимые данные в форму."

  - Можно лучше:

    - по другому использовать доступное пространство: визуальный элемент "column column_type_output" занимает очень много места на странице, 
        но показывает очень мало информации и его размер можно уменьшить. Другие элементы на странице показывают много информации 
        (список рейтингов или несколько радиокнопок), но имеют небольшой размер. Их размер можно увеличить что бы пользователь
        сразу видел весь их контент.

  - Надо исправить:

    - названия радиокнопок формы не видны, если высота браузера меньше "600px": у текста белый шрифт на белом фоне (нужен скриншот?)
        текст "Введите данные" не полностью виден, если ширина браузера меньше "600px"
        имя пользователя наезжает на список пользователей, если ширина браузера меньше "600px"
        Необходимо сразу проверять работу сайта на разных размерах браузера

* "Исходя из данных, введенных в форму - получить свой рейтинг."

  - Можно лучше

    - Вызовы "document.querySelector" есть в разных файлах: Person.js, script.js, enums.js - это код для работы с DOM
        Можно убрать эти вызовы из файлов с алгоритмами и данными (и почитать MVVM)
      См https://habr.com/ru/company/itelma/blog/546372/ и https://blog.webf.zone/contemporary-front-end-architectures-fb5b500b0231

  - Надо исправить:

    - Присвоение значения в свойство 'innerHTML' для вывода пользовательских значений не безопасно: Man._valueElement.innerHTML = name;
        Это свойство позволяет внедрять чужие скрипты в код вашего сайта: https://medium.com/@jenlindner22/the-risk-of-innerhtml-3981253fe217
        + https://ru.stackoverflow.com/questions/1142971


* "Воспользоваться моковым регистронезависимым поиском по имени для просмотра рейтинга других пользователей."

  - Надо исправить:
  
    - Алгоритм поиска не начинает работу при вводе в инпут каждого символа
        Рекомендую проверить контекст this для обработчика события keyup

    - Алгоритм поиска не начинает работу при нажатии Enter 
        (в форме columns__search-item нет DOM елемента button, хотя в классе Search для него есть код)
        Рекомендую проверять работу формы на нескольких комбинациях значений: заранее посчитать для них результат 
        и проверить, что сайт покажет то же самое значение

    - В задании требуется "регистронезависимый поиск", но сейчас используется вызов "currentItem._names.includes(value)"
        который выполняет case-sencitive поиск, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes

*/
