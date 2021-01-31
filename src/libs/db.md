# Organizacja bazy danych

## v2.0

### Zmiana organizacji w kolekcji 'layout'

- layout
  - `contentType`
    Określa rodzaj elementu, jaki jest definiowany w rekordzie.
  - `parent`
    Przechowuje ID rekordu nadrzędnego.
  - `childs`
    Zawiera listę elementów pochodnych.

Ponieważ, `contentType` determinuję strukturę rekordu w oparciu o właściwości elementu, jego szerszy opis znajduje się w pliku [Layout](../components/page-elements/elements.md)

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
