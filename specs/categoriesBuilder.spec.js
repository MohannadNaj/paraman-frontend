import CategoriesBuilder from '../src/js/CategoriesBuilder'

describe('CategoriesBuilder Class', () => {
  let vm = null

  beforeEach(()=> {
    vm = new CategoriesBuilder([])
  })

  afterEach(() => {

  })


  it('merge categories ids function', () => {
    let mergeFunc = (...args) => {
        return vm.mergeCategoriesWithCategoriesIds(...args)
    }

    let merge = mergeFunc(['1','2',3,4,'5'], [{id:5},{id:3}] )

    expect(merge.sort())
    .toEqual(['1','2','3','4','5'].sort())

    merge = mergeFunc(['1',2,3,'4','5'], [{id:3}] )
    expect(merge.sort())
    .toEqual(['1','2','3','4','5'].sort())

    merge = mergeFunc(['1',2], [{id:3}] )
    expect(merge.sort())
    .toEqual(['1','2','3'].sort())

    merge = mergeFunc([1,2], [{id:3},{id:4}] )
    expect(merge.sort())
    .toEqual(['1','2','3','4'].sort())

  })
})

let textContent = () => {return window.vm.$el.textContent}
