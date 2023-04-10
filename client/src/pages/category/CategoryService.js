export class CategoryService {

    getCategories() {
        return fetch('./categories.json').then(res => res.json()).then(d => d.data);
    }

}