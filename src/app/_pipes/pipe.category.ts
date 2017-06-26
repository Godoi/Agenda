import{ Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name:'filterCategory'
})
export class FilterCategory implements PipeTransform{
    transform(items, filter){
        filter = filter.toLowerCase();
        return items.filter(items => items.category.toLowerCase().includes(filter));
    }
}