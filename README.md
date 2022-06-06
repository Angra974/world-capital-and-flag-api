# world-capital-and-flag-api
An simple api to get the capital of a country and or the flag of this country

## How to use the api
```Javascript
'/api/random' + a number between 1 and 10
```
 to get random value of data ( contains id,alpha code 2, alpha code 3, name of country and the capital name)

 ---

```Javascript
'/api/filter' + {option}
```
option can be capital, country, alpha2, or alpha3
Option are :

1. /api/filter/?capital=Algiers : to get "Algeria" as a result
1. /api/filter/?country=Algeria : to get Algiers as a capital
1. /api/filter/?alpha2=dz : to get the full data for Algeria ( id/alpha code 2/3, country, capital)
1. /api/filter/?alpha3=dza : to get the full data for Algeria ( id/alpha code 2/3, country, capital)

```Javascript
'/api/flag' + {option}

exemple:
'/api/flag/?capital=Algiers&imgSize=m
```
option can be
            - capital
            - country
            - alpha2
            - alpha3
            with size of the image
size of the image can be:
    - small : s
    - medium : m
    - large : l
    - extra large : xl

---

```Javascript
'/api/list' + {option}

exemple:
'/api/list/?filter=capital
```

Get a list of all the showAll
option can be
            - capital : get a list of all capitals
            - country : get a list of all the countires
            -  both : get a list of all countries with their capital
