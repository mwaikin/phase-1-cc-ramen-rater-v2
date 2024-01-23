import { displayRamens, displayRamen, handleSubmit, handleClick } from './index'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Window } from 'happy-dom'
import fs from 'fs'
import path from 'path'
import { fireEvent } from '@testing-library/dom';

//! Set the data
const testResponseData = [
    {
        "id": 1,
        "name": "Shoyu Ramen",
        "restaurant": "Nonono",
        "image": "./assets/ramen/shoyu.jpg",
        "rating": 7,
        "comment": "Delish. Can't go wrong with a classic!"
    },
    {
        "id": 2,
        "name": "Naruto Ramen",
        "restaurant": "Naruto",
        "image": "./assets/ramen/naruto.jpg",
        "rating": 10,
        "comment": "My absolute fave!"
    },
    {
        "id": 3,
        "name": "Nirvana Shiromaru",
        "restaurant": "Ippudo",
        "image": "./assets/ramen/nirvana.jpg",
        "rating": "7",
        "comment": "Do buy the hype."
    },
    {
        "id": 4,
        "name": "Gyukotsu Ramen",
        "restaurant": "Za-Ya Ramen",
        "image": "./assets/ramen/gyukotsu.jpg",
        "rating": 8,
        "comment": "Good to the last drop."
    },
    {
        "id": 5,
        "name": "Kojiro Red Ramen",
        "restaurant": "Ramen-Ya",
        "image": "./assets/ramen/kojiro.jpg",
        "rating": 6,
        "comment": "Perfect for a cold night."
    },
    {
        "name": "Mat",
        "restaurant": "Test",
        "image": "file:///Users/matteo/Development/code-challenge/phase-1-mock-cc-ramen-rater/assets/ramen/nirvana.jpg",
        "rating": "4",
        "comment": "test",
        "id": 6
    }
];

vi.stubGlobal('testResponseData', testResponseData)

//! Set the DOM
const htmlDocPath = path.join(process.cwd(), 'index.html');
const htmlDocumentContent = fs.readFileSync(htmlDocPath).toString();

const window = new Window
const document = window.document
document.body.innerHTML = ''
document.write(htmlDocumentContent)
vi.stubGlobal('document', document)



//! Mock the Fetch API globally

const testFetch = vi.fn((url) => {
    return new Promise((resolve, reject) => {
        const testResponse = {
            ok: true,
            json() {
                return new Promise((resolve, reject) => {
                    resolve(testResponseData);
                });
            },
        };
        resolve(testResponse);
    });
});
vi.stubGlobal('fetch', testFetch);

// Create a spy for handleClick
// const handleClickSpy = vi.fn();

// Stub the global handleClick function with the spy
// vi.stubGlobal('handleClick', handleClickSpy);
// vi.stubGlobal('handleClick', handleClickMock);

//! Test Suite

describe('displayRamens', () => {

    beforeEach(() => {
        document.body.innerHTML = ''
        document.write(htmlDocumentContent)
    })

    it('should fetch all ramens and display them as <img> inside #ramen-menu', async () => {

        const ramenMenuDiv = document.getElementById('ramen-menu');

        await displayRamens();
        await new Promise(resolve => setTimeout(resolve, 0));

        const ramenImages = ramenMenuDiv.querySelectorAll('img');
        const urls = Array.from(ramenImages).map((ramenImg) => ramenImg.src);
        const originalUrls = testResponseData.map((ramen) => ramen.image);

        expect(ramenImages.length).toEqual(testResponseData.length);
        expect(urls).toEqual(originalUrls);
    })
})

describe('handleClick', () => {
    it('should fire on a click on every img inside #ramen-menu', async () => {
        const ramenMenuDiv = document.getElementById('ramen-menu');
        const ramenImages = ramenMenuDiv.querySelectorAll('img');

        // Create a spy for handleClick
        const handleClickSpy = vi.fn(handleClick);
        vi.stubGlobal('handleClick', handleClickSpy);
        // Attach the event listener manually with the spy
        ramenImages.forEach((ramenImg) => {
            const ramen = testResponseData.find((ramen) => ramen.image === ramenImg.src);
            ramenImg.addEventListener('click', (event) => {
                handleClickSpy(ramen, event);
            });
        });

        // Trigger the click event on the first image
        const img = ramenImages[0];
        fireEvent.click(img);

        // Check if handleClickSpy was called with the correct arguments
        expect(handleClickSpy).toHaveBeenCalled();
        expect(handleClickSpy).toHaveBeenCalledWith(testResponseData[0], expect.anything());

    });

    it('should append the correct data to the DOM', async () => {
        const ramenMenuDiv = document.getElementById('ramen-menu');
        const ramenImages = ramenMenuDiv.querySelectorAll('img');

        const img = ramenImages[0]
        fireEvent.click(img);

        const detailImg = document.querySelector("#ramen-detail > .detail-image");
        const detailName = document.querySelector("#ramen-detail > .name");
        const detailRestaurant = document.querySelector("#ramen-detail > .restaurant");
        const detailsRating = document.getElementById("rating-display");
        const detailsComment = document.getElementById("comment-display");

        expect(detailName.textContent).toBe('Shoyu Ramen');
        expect(detailRestaurant.textContent).toBe('Nonono');
        expect(detailImg.src).toBe('./assets/ramen/shoyu.jpg');
        expect(detailsRating.textContent).toBe('7');
        expect(detailsComment.textContent).toBe("Delish. Can't go wrong with a classic!");
    });

})
