# Layout (Szablon lub Schemat - jak kto woli :P)

W ramach jednego serwisu można budować wiele szablonów.

_Linie poprzedzone checkboxem, wskazują na stan implementacji danego elementu._

## Podział elementów

W skład szablonu wchodzą różne elementy, jednak ich główny podział to:

- [x] **blokowe**
- [x] **kontekstowe**

### Elementy blokowe

Te elementy budują strukturę szablonu i na jej podstawie budowany jest widok strony. Oto ich lista:

- [x] **header**
- [x] **router-menu**
- [x] **router-content**
- [x] **footer**
- [x] **row**

Teoretycznie można je układać w różnych konfiguracjach, jednak nie ręczę za skutki i poprawne działanie tak skonstruowanego schematu strony.

### Elementy kontekstowe

Tworzą lub przechowują treść, która jest widoczna na stronie.

- [x] **menu-item**
- [x] **lang-selector**
- [x] **card**
- [x] **calendar**
- [ ] **galery**
- [ ] **comments**

## Opis elementów blokowych (kontenerów)

### `header`

Definiuje blok grupujący elementy nagłówka strony.

**Atrybuty**: Ten element nie posiada definiowanych atrybutów.

### `router-menu`

Jest blokiem grupującym pozycje menu. Oparty o właściwość `css.@media`, domyślnie wyświetla podrzędne mu elementy w wierszu lub ukrywa je w rozwijanej liście.

**Atrybuty**:

- [ ] _queryPoint_ - definicja progu @media
- [ ] _trigger_ - pozwala zdefiniować wygląd przełącznika dla listy (używa Markdown)

### `router-content`

Blok przechowujący elementy strony dla podanej trasy _path_.

**Atrybuty**:

- [x] _exact_
- [x] _path_ - ścieżka trasa
- [x] _id_ - identyfiator trasy - jest kojarzony z elementem kontekstowym **menu-item**
- [ ] _options_ - ustawienia

  - [ ] _useLayout_ - umożliwia wybranie szablonu dla renderowanej trasy. W przypadku braku tego ustawienia, stosowany jest szablon domyślny.

    Domyślnie: brak ustawienia

### `footer`

Definiuje blok odpowiedzialny za stopkę strony.

**Atrybuty**: Ten element nie posiada definiowanych atrybutów.

### `row`

Pozwala ułożyć podrzędne mu elementy w wierszu.

**Atrybuty**: Ten element nie posiada definiowanych atrybutów.

## Opis elementów kontekstowych

### `menu-item`

Tworzy pozycje menu.

**Atrybuty**:

- [x] _id_ - identyfikator kojarzony z elementem router-content
- [x] _title_ - nazwa wyświetlana (`langObject`)

### `lang-selector`

Pozycja menu pozwalająca wybierać język dla strony.

**Atrybuty**: Ten element nie posiada definiowanych atrybutów.

### `card`

Wyświetla treść karty podanej jako argument _name_.

**Atrybuty**:

- [x] _name_
- [x] _options_ - ustawienia

  - [x] _noLangWarnings_ - flaga, odpowiedzialna za nie wyświetlanie ostrzeżenia związanego ze zmianą preferowanego języka w treści karty.

    Domyślnie: ustawiona

  - [ ] _useMarkdown_ - flaga, pozwala używać do formatowania treści karty języka znaczników Markdown.

    Domyślnie: ustawiona

  - [x] _body_ - zawiera treść karty (`langObject`)

### `calendar`

Wyświetla wpisy kalendarza.

**Atrybuty**:

- [x] _path_ - wewnętrzna ścieżka zawierająca wpisy kalendarza
- [ ] _options_ - ustawienia

  - [ ] _view_ - tablica flag, definiująca wyświetlane elementy wpisu kalendarza

    - [ ] _showDate_ - ustawiona, pokazuję datę utworzenia wpisu w kalendarzu

      Domyślnie: ustawiona

    - [ ] _showTitle_ - ustawiona, pokazuje tytuł.

      Domyślnie: ustawiona

    - [ ] _showDescription_ - ustawiona, pokazuje krótki opis.

      Domyślnie: ustawiona

  - [ ] _limit_ - definiuje wartość związaną z ilością wyświetlanych wpisów kalendarza.

    Domyślnie: 0 - bez limitu

  - [ ] _pagination_ - flaga, pozwala na stronicowanie elementu kalendarza.

    Domyślnie: nie ustawiona

## Właściwa budowa szablonu

Jak wspomniałem wcześniej, elementy szablonu można teoretycznie układać w dowolny sposób. Jednak, nie sprawdzałem ich zachowania oraz tego, jak będą wyglądać po zrenderowaniu.

Przedstawiam więc przewidziany właściwy układ, który na pewno będzie działać bez zaskoczenia :P

```
ROOT
 |
 +- header
 |    |
 |    +- router-menu
 |          |
 |          +- menu-item
 |          |
 |          +- menu-item
 |          .
 |          .
 |          +- lang-selector
 |
 +- router-content
 |     |
 |     +- card       \
 |     |             |
 |     +- calendar   | w dowolnej konfiguracji
 |     |             |
 |     +- galery     | i ilości
 |     |             |
 |     +- comments   /
 |
 +- footer
       |
       +- row
       |   |
       |   + - np. card
       |   |
       |   + - np. card
       |
       +- row
           |
           + - np. card
```

Elementy w sekcji `header` oraz `router-content`, podobnie jak w `footer` można umieszczać w blokach `row`.

## Jak to wygląda w HTMLu?

Budowa szablonu po zrenderowaniu go, pozwala zrozumieć jak zachowają się poszczególne elementy.

Oparłem cały system na Flexboxie. Patrząc na schemat zamieszczony w _Właściwa budowa szablonu_, każdy element blokowy (poza `row`) ma zdefiniowany następujący styl:

```css
display: flex;
flex-direction: column;
```

`row` ma ustawioną właściwość `flex-direction` na `row` :|

Elementy kontekstowe, zachowują się jak typowe dla HTMLa elementy blokowe.

## langObject - multi-language

W elementach kontekstowych definiujących treść np. **card** można znaleźć atrybut który został oznaczony `langObject`.

Jest to atrybut który jest obiektem JSON. Właściwości tego obiektu zawierają treści dla różnych wersji językowych elementów kontekstowych. Ich treści definiowane są przez klucz (jego nazwa), który jest oznaczeniem języka, i wartość, która zawiera treść.

Przyjąłem za standard używanie ISO 3166-1 alpha-2, który jest użyty dla flag narodowych, pokazywanych w elemencie kontekstowym **lang-selector**. Poza tym, to nazewnictwo jest krótkie i bardzo często szybko kojarzone przez użytkowników.
