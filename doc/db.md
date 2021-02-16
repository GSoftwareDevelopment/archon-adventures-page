# Organizacja bazy danych

## v2.3

### Zmiana w elemencie kolekcji Layout

Do elementu `menu-item` doszła nowa właściwość:

- `destRoute` - określa ścieżkę trasy.

Można w niej stosować ID trasy (używany w elemencie `content-route` do bezpośredniej identyfikacji trasy) należy poprzedzić taki ID znakiem `#` (hash).
Parser rozpoznaje go i na postawie dalszej treści (do znaku `EOL` lub `/` (slash) ) wyszukuje identyfikator w zdefiniowanych trasach.

Taką ścieżkę można "przedłużać", np. `#calendar-cards/my-card` pozwoli odwołać się do trasy, jaka została zdefiniowana dla identyfikatora `calendar-cards` po czym dodany zostanie dalszy ciąg do trasy.

**UWAGA!!** Właściwość `id` elementu `menu-item` została zachowana, jednak z poziomu **Site Managera** nie można już jej definiować.

## v2.2

### Nowa kolekcja `comments`

Przeznaczeniem jej jest, przechowywanie komentarzy i wiadomości dla elementów kontekstowych `card`, `galery`, `comments` oraz `users`.

Zawiera następujące pola:

- `userId` - identyfikator właściciela komentarza
- `destCollection` - nazwa kolekcji w której zamieszczony jest komentarz
- `destId` - identyfikator elementu w kolekcji `destCollection` do którego odwołuje się komentarz
- `message` - treść komentarza
- `createdAt` - stempel czasowy utworzenia komentarza
- `rootCollection` - nazwa kolekcji źródłowej z której pochodzi komentarz
- `rootId` - identyfikator elementu w kolekcji `rootCollection`
- `private` - oznaczenie wiadomości prywatnej
- `readed` - wskazuje na stan przeczytania wiadomości prywatnej

Pola `rootCollection` oraz `rootId` mogą nie występować lub mieć wartość `null`. Znaczyć to będzie, że źródło komentarza wskazywać będą `destCollection` oraz `destId`.

Wiadomości prywatne, przechowywane są w kolekcji do czasu ich przeczytania.

## v2.1

### Rozszerzenie kolekcji `users`

Doszły pola:

- `role` - określa rolę jaką pełni użytkownik w aplikacji
- `imageURL` - adres URL do obrazu użytkownika
- `extraVisibility` - tablica pól, które będą widoczne dla innych użytkowników aplikacji

Dodatkowo w każdym rekordzie akceptowalne są pola, które można zdefiniować w pliku [/src/libs/profileFields](profileFields.js) w obiekcie 'extraFields'.

Więcej na temat obiektu 'extraFields' oraz pliku 'profileFields' w [tym dokumencie](profileFields.md)

## v2.0

### Zmiana organizacji w kolekcji `layout`

- layout
  - `contentType`
    Określa rodzaj elementu, jaki jest definiowany w rekordzie.
  - `parent`
    Przechowuje ID rekordu nadrzędnego.
  - `childs`
    Zawiera listę elementów pochodnych.

Ponieważ, `contentType` determinuję strukturę rekordu w oparciu o właściwości elementu, jego szerszy opis znajduje się w pliku [Layout](elements.md)

## v1.x

### Kolekcje

- calendar
  - `createdAt`
  - `path`
  - `name`
  - `body`
  - `lang`
  - `cardRefTo`
- card
  - `path`
  - `name`
  - `body`
  - `lang`
  - `createdAt`
- galery
  - `path`
  - `name`
  - `title`
  - `images`
- layout
  - `name`
  - `current`
  - `userId (!)`
  - `createdAt`
  - `scheme`
  - `langs`
  - `defaultLang`
- users
  - `userId (!)`
  - `firstName`
  - `lastName`
  - `name`
