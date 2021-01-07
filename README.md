[![Netlify Status](https://api.netlify.com/api/v1/badges/7f96c299-f07e-4785-b9c6-8c778097764d/deploy-status)](https://app.netlify.com/sites/archonadventures/deploys)

# O projekcie

Projekt jest adaptacją strony internetowej z implementacją następujących technologii:

- [x] React
- [x] MongoDB Realm
- [x] Netlify
- [ ] Radium

# Założenia projektu

Chicałem stworzyć stronę internetową która nie potrzebowałaby **_dedykowanego backendu_**. W jak **_najmniejszym_** stopniu wykorzystywała przetwarzanie po stronie serwera.

# Co zawiera projekt?

Oprócz właściwej strony w projekcie jest też "zaszyty" interfejs CMSa do zarządzania stroną.
Jest on w początkowej fazie rozwoju i zawiera:

- Proces autoryzacji
  - [x] logowanie
  - [x] wylogowanie
  - [ ] podział na role użytkowników
- Zarządzanie szablonami

  - [ ] tworzenie nowego szablonu
  - [ ] modyfikacja
  - [ ] usuwanie
  - Operacje na elementach
    - [ ] tworzenie nowych elementów
    - [ ] edycja
    - [ ] usuwanie
  - Elementy

  W elementach zastosowałem oznaczenia "CRUD" od Create Read Update Delete, gdzie Read należy czytać jako Wyświetlenie :) Występowanie symbolu jest równoważne z implementacją.

  - [x] - elementy blokowe
    - [x] - Header `[-R--]`
    - [x] - Router-Menu `[-R--]`
    - [x] - Router-Content `[-R--]`
    - [x] - Footer `[-R--]`
    - [x] - Row `[-R--]`
  - [x] - elementy kontekstowe
    - [x] - Menu-Item `[-R--]`
    - [x] - Lang-Selector `[-R--]
    - [x] - Card `[-RU-]`
    - [x] - Calendar (odpowiednik bloga) `[-R--]`
    - [ ] - Galery `[----]`
    - [ ] - Comments `[----]`
  - [ ] - Style elementów `[----]`
      Jak na razie, cały wygląd strony definiowany jest [stylami SCSS](/src/components/layout) zaszytymi w aplikacji.

    Przewiduję możliwość definiowani własnych dla każdego elementu, z pomocą biblioteki [**Radium**](https://github.com/FormidableLabs/radium/tree/master/docs/guides#media-queries) i zaszyciu ich w bazie danych.

Więcej na temat elementów można przeczytać [TU](/src/components/page-elements/elements.md)

Jak widać, dużo jeszcze zostało do zrobienia.
