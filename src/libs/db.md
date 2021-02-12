# Organizacja bazy danych

## v2.1

### Rozszerzenie kolekcji 'users'

Doszły pola:

- role
- imageURL
- extraVisibility

Dodatkowo w każdym rekordzie można akceptowalne są pola:

- gender
- birthday
- about
- country
- city
- email
- social-FB
- social-LinkedIn
- social-Tinder
- social-Instagram
- social-Twitter
- social-YouTube
- social-Skype
- social-GitHub

Pola te, są definiowane w pliku [profileFields](profileFields.js)

## v2.0

### Zmiana organizacji w kolekcji 'layout'

- layout
  - `contentType`
    Określa rodzaj elementu, jaki jest definiowany w rekordzie.
  - `parent`
    Przechowuje ID rekordu nadrzędnego.
  - `childs`
    Zawiera listę elementów pochodnych.

Ponieważ, `contentType` determinuję strukturę rekordu w oparciu o właściwości elementu, jego szerszy opis znajduje się w pliku [Layout](../components/layout/page-elements/elements.md)

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
