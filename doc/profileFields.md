# Opis pliku `profileFields.js` i obiektów `basicFields` oraz `extraFields`

Plik `profileFields.js` jest definicją pól, jakimi użytkownik może opisać swój profil w aplikacji.
Składa się on z dwóch obiektów:

- `basicFields`, opisującego podstawowe informacje dt. użytkownika
- `extraFields`, opisujące rozszerzone informacje.

W skład każdego obiektu wchodzą właściwości:

- _name_ - nazwa pola w kolekcji `users`
- _title_ - tekst opisujący pole
- _type_ - typ pola (patrz pkt. **Typy pól**)
- _placeholder_ - tekst zastępczy dla pola
- _options_ - (tylko dla `type=select`) tablica opcji listy wyboru

## Typy pól

Dostępne typy pól, są dokładnie takie same, jak dla taga HTML `<input type=... />`. Dodatkowo można zdefiniować jeszcze: `textarea` oraz `select`.

Pola mają domyślne ograniczenie (programowe) co do ilości znaków jakie można wprowadzić, tzn. mają ustawiony atrybut `maxLength` na 128 znaków, a w przypadku typu `textarea` na 1024 znaki.

Warto zadbać (w przypadku własnych definicji), aby kolekcja `users` nie przyjmowała zbyt długich ciągów znaków, poprzez ustawienie schematu w usłudze Realm.
