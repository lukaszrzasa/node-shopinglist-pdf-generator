## Tytułem wstępu
Zanim zajrzysz do kodu proszę, przeczytaj ten tekst (a przynajmniej ostatni akapit) ;)

## Zapotrzebowanie
Jednym z obowiązków animatorów ProtoLabu w Podkarpackim Centrum Innowacji jest przygotowywanie list zakupowych. Każda pozycja musi być odpowiednio opisana (cena, ilość, uzasadnienie, link do sklepu, zrzut ekranu ze sklepu). Podobnie dla kontroferty.

Największym problemem jest liczba pozycji. Może to być ich od kilkunastu do kilkudziesięciu (zapotrzebowanie pracowni, projekty użytkowników). Ciężko jest zautomatyzować szukanie kontrofert czy też wyciąganie ze strony niezbędnych informacji o produkcie. No, a przynajmniej mało opłacalne, jeśli chodzi o czas potrzebny na implementację. Najłatwiej oczywiście zautonomizować robienie screenów oraz generować gotowe zestawienia na podstawie arkusza excel. Tym właśnie się zająłem.

## Technologia
 Jako że na co dzień zajmuję się frontend-em, wybrałem **node.js**, dodatkowo bardzo przydatne przydały się biblioteki:
- webshot - screenshot from URL
- convert-excel-to-json
- pdfmake - pdf from JSON
- (pozostałe, mniej znaczące znajdują się w packages.json)

## Wyzwanie
Największym wyzwaniem było...w zasadzie wszystko. Każda rzecz: przetwarzanie excela, robienie screenów na podstawie URL czy też generowanie PDFa było czymś nowym. No może poza samym obeznaniem z JavaScriptem. ;)

## Początki prac
Pierwsza część polegała na znalezieniu odpowiednich "gotowców" (bibliotek) i przetestowaniu ich w praktyce. Niestety tego etapu prac nie znajdziecie w kodzie. Nie chciałem dodawać do kodu niepotrzebnych elementów - i tak nie jest on "ładny", a same testy przeprowadziłem jeszcze przed przystąpieniem do pracy.

Co sprawdzałem w 3 najważniejszych dla projektu bibliotekach przed przystąpieniem do pracy?
- **Webshot** - Jak działa robienie/zapisywanie screenów? Jak działa obsługa błędów? Co, jeśli za parametr damy string, który nie jest poprawnym URL? Okazuje się, że biblioteka jest dość prosta, jednak obsługa błędów już nieco bardziej problematyczna. O tym więcej w dalszej części.
- **convert-excel-to-json** - Czyli jak przetwarzać dane z excela. Jak się okazało jest to najprostsza w obsłudze paczka ;), jednak jej zastosowanie w projekcie kończy się na zapisaniu danych z excela do obiektu.
- **pdfmake** - początkowo do testów użyłem innej biblioteki - *jspdf*, niestety nie miała ona wsparcia UTF-8, a same zdjęcia nie chciały się czasem renderować. Szkoda, bo w przeciwieństwie do pdfmake była bardziej intuicyjna w użytkowaniu.

Całość nie zajęła długo, bo raptem 30-45 minut na przeanalizowanie wszystkich 3+ bibliotek.

## Napotkane problemy
Pierwszym z nich okazała się obsługa błędów paczki **webshot**. Nie wiem dlaczego, ale parametr funkcji **err** nigdy nie przyjmował żadnych wartości. Przekazanie do funkcji wadliwego URL strony internetowej powodowało nieskończone oczekiwanie - program się zacinał (znaczy dokładniej promise - dla bardziej wtajemniczonych). Postawiłem na zwykłe setTimeout(fn), czyli funkcja, która po określonym czasie sprawdzała czy powiodło się, czy też nie. (tak wiem, nie jest to optymalne rozwiązanie).

Kolejnym problemem jak się okazało było...**zabezpieczenie przed botami**. Zwyczajnie gdy arkusz zawierał kilkadziesiąt linków do jednego sklepu, to zbyt szybkie robienie zdjęć powodowało blokadę...ze strony serwera. Jako, że zależało mi na szybkim ukończeniu ponownie wykorzystałem setTimeout(), a czas pomiędzy kolejnymi zdjęciami ustawiłem na 10 sekund.

Kolejna biblioteka - PDFMake generuje plik na podstawie tablicy obiektów. Nie jest to do końca wygodne. Niektóre funkcjonalności również okazały się trudne do implementacji (np page break). Nie jest to może problem, ale nieco irytował mnie sposób jej działania.

## Finalny efekt - sposób działania
Oczywiście nie traktuj tego jak instrukcję użytkowania. Należy wcześniej przygotować środowisko, zainstalować paczki itp. Ja chcę tylko pokazać schemat.

1. Należy progotować arkusz excel wg schematu (kolumny po kolei mają zawierać odpowiednie wartości - lp, nazwa, cena, ilość, itd)
2. Przygotowany tak plik excel.xlsx należy umieścić w głównym folderze z projektem.
3. Aby uruchomić generowanie na podstawie tych danych zdjęć, należy wpisać w konsoli komendę `node get-images.js`. Skrypt będzie działał od kilku sekund do kilkunastu minut. Oczywiście będzie działał w tle - jednocześnie możesz robić co kolwiek tylko chcesz ;)
4. W trakcie jego działania będziesz informowany o tym, jak przebiega proces.
5. Na zamym końcu pojawi się tabela ze szczegółową informacją o błędach (o ile takie się pojawią).
6. W ramach działania programu powstał nowy plik `output.json`, zawiera informacje, które posłużą do wygenerowania PDFa
7. Aby wygenerować PDFa należy teraz wpisać komendę `node make-pdf.js`
8. Całość potrwa znacznie krócej, max kilka s
9. W rezultacie zostanie wygenerowany plik .pdf, który zawiera zestawienie danych z excela ze zrzutami ekranu każdego ze sklepu.

Całość (łącznie z przygotowaniami) zajęła mi w okolicach 3h z przerwami.

## Zanim zajrzysz do kodu / Podsumowanie
Znasz cytat "pracuj mało, ale mądrze"? Taki właśnie był cel tego projektu. Chciałem poświęcić jak najmniej czasu, jednocześnie ułatwiając pracę osobom, które tworzą to miejsce (ProtoLab), o korzyściach z nauki już nie wspominam :). 

Owszem, zdaję sobie sprawę z tego, że kod jest brzydki, że powinien zawierać testy jednostkowe, itp itd. Potraktowałem to zadanie jak zabawę, początkowo nie miałem zamiaru go nawet udostępniać. Robię to, żeby pokazać Wam jacy ludzie działają codziennie w Podkarpackim Centrum Innowacji. Proszę, potraktujcie go z przymrużeniem oka. A jak możecie...zostawcie feedback ;)