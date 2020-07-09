// Storage
const Storage = (function () {

    return {
        read: function () {
            let data
            if (localStorage.getItem('items') == null) {
                data = []
            } else {
                data = JSON.parse(localStorage.getItem('items'))
            }
            return data
        },
        create: function (obj) {
            let data
            if (localStorage.getItem('items') == null) {
                data = []
                data.push(obj)
                localStorage.setItem('items', JSON.stringify(data))
            } else {
                data = JSON.parse(localStorage.getItem('items'))
                data.push(obj)
                localStorage.setItem('items', JSON.stringify(data))
            }
        },
        update: function (object) {
            let data = JSON.parse(localStorage.getItem('items'))
            data.forEach((item, index) => {
                if (item.id === object.id) {
                    data.splice(index, 1, object)
                }
            })
            localStorage.setItem('items', JSON.stringify(data))
        },
        delete: function (id) {
            let data = JSON.parse(localStorage.getItem('items'))
            data.forEach((element, index) => {
                if (element.id === id) {
                    data.splice(index, 1)
                }
            })
            localStorage.setItem('items', JSON.stringify(data))
        },
        deleteAll: function () {
            let data = []
            localStorage.setItem('items', JSON.stringify(data))
        }
    }
})()

// UI
const UICtrl = (function () {
    const UIList = {
        item_list: "item-list",
        total_calories: "total-calories",
        add_btn: "addBtn",
        delete_btn: "deleteBtn",
        update_btn: "updateBtn",
        back_btn: "backBtn",
        mealName: "meal_name",
        calories: "calories",
        editButton: "edit-item",
        clearAll: "clearAll"
    }

    return {
        showItems: function (items) {
            items.forEach(element => {
                document.getElementById(UIList.item_list).innerHTML +=
                    `<li class="collection-item" id="item-${element.id}">
                <strong>${element.name} : </strong><strong>${element.calories} calories</strong>
                <a href="" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            </li>`
            });
        },
        showCalories: function (totalCalories) {
            document.getElementById(UIList.total_calories).textContent = totalCalories
        },
        showSingleItemChange: function (object) {
            document.getElementById(`item-${object.id}`).innerHTML =
                `<strong>${object.name} : </strong><strong>${object.calories} calories</strong>
            <a href="" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`
            UICtrl.clearEditState()
        },
        deleteSingleItem: function (id) {
            document.getElementById(`item-${id}`).remove()
            UICtrl.clearEditState()
        },
        deleteAllItem: function () {
            document.getElementById(UIList.item_list).innerHTML = ''

        },
        getItemList: function () {
            return UIList.item_list
        },
        getAddButtonId: function () {
            return UIList.add_btn
        },
        getDeleteButtonId: function () {
            return UIList.delete_btn
        },
        getUpdateButtonId: function () {
            return UIList.update_btn
        },
        getClearAllId: function () {
            return UIList.clearAll
        },
        getBackButtonId: function () {
            return UIList.back_btn
        },
        getEditButtonId: function () {
            return UIList.editButton
        },
        getAddedItem: function () {
            let mealName = document.getElementById(UIList.mealName).value
            let calories = document.getElementById(UIList.calories).value
            let object = {
                name: mealName,
                calories: Number(calories)
            }
            return object
        },

        showNewItem: function (item) {
            document.getElementById(UIList.item_list).insertAdjacentHTML('beforeend',
                `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name} : </strong><strong>${item.calories} calories</strong>
                <a href="" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>
            </li>`)
            UICtrl.clearField()
        },
        showInsideForm: function (item) {
            document.getElementById(UIList.mealName).value = item.name
            document.getElementById(UIList.calories).value = item.calories
            UICtrl.showEditState()
        },
        clearField: function () {
            document.getElementById(UIList.mealName).value = ''
            document.getElementById(UIList.calories).value = ''
        },
        clearEditState: function () {
            UICtrl.clearField()
            document.getElementById(UIList.add_btn).style.display = 'block'
            document.getElementById(UIList.delete_btn).style.display = 'none'
            document.getElementById(UIList.update_btn).style.display = 'none'
            document.getElementById(UIList.back_btn).style.display = 'none'
        },
        showEditState: function () {
            document.getElementById(UIList.add_btn).style.display = 'none'
            document.getElementById(UIList.delete_btn).style.display = 'block'
            document.getElementById(UIList.update_btn).style.display = 'block'
            document.getElementById(UIList.back_btn).style.display = 'block'
        },
    }

})()

// Item
const ItemCtrl = (function () {

    const item = function (id, name, calories) {
        this.id = id
        this.name = name
        this.calories = calories
    }

    const data = {
        items: Storage.read(),
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function () {
            return data.items
        },
        addSingleItem: function (newItem) {
            console.log(data.items.length)
            newId = data.items.length
            const object = new item(newId, newItem.name, newItem.calories)
            data.items.push(object)
            return object
        },
        retrieveItem: function (id) {
            let found
            data.items.forEach(item => {
                if (item.id === Number(id)) {
                    found = item
                }
            })
            data.currentItem = found
            return found
        },
        updateItem: function (object) {
            data.items.forEach(element => {
                if (element.id === data.currentItem.id) {
                    element.name = object.name
                    element.calories = object.calories
                    object = element
                }
            })
            return object

        },
        deleteItem: function () {
            data.items.forEach((item, index) => {
                if (item.id === data.currentItem.id) {
                    data.items.splice(index, 1)
                }
            })
            return data.currentItem.id
        },
        deleteAllItem: function () {
            data.items = []
        },
        logData: function () {
            console.log(data.items)
        },
        getTotalCalories: function () {
            let total = 0
            data.items.forEach(element => {
                total += element.calories
            })
            data.totalCalories = total
            return data.totalCalories
        }
    }

})()
// App
const App = (function () {

    const loadEventListener = function () {
        document.getElementById(`${UICtrl.getAddButtonId()}`).addEventListener('click', addItemsToItemCtrl)
        document.getElementById(`${UICtrl.getItemList()}`).addEventListener('click', editClickItems)
        document.getElementById(`${UICtrl.getDeleteButtonId()}`).addEventListener('click', deleteItem)
        document.getElementById(`${UICtrl.getUpdateButtonId()}`).addEventListener('click', updateItem)
        document.getElementById(`${UICtrl.getBackButtonId()}`).addEventListener('click', backState)
        document.getElementById(`${UICtrl.getClearAllId()}`).addEventListener('click', deleteAll)
        document.addEventListener("keypress", function (e) {
            if (e.keyCode == 23) {
                e.preventDefault()
            }
        })

    }

    function addItemsToItemCtrl() {
        const newItem = UICtrl.getAddedItem()
        const obj = ItemCtrl.addSingleItem(newItem)
        UICtrl.showNewItem(newItem)
        Storage.create(obj)
    }

    function editClickItems(e) {
        e.preventDefault()
        if (e.target.classList.contains('edit-item')) {
            const ID = e.target.parentNode.parentNode.id.split("-")[1]

            const item = ItemCtrl.retrieveItem(ID)
            UICtrl.showInsideForm(item)

        }

    }

    function updateItem(e) {
        e.preventDefault()
        let formData = UICtrl.getAddedItem()
        let object = ItemCtrl.updateItem(formData)
        UICtrl.showSingleItemChange(object)
        Storage.update(object)

    }

    function deleteItem(e) {
        e.preventDefault()
        let objectId = ItemCtrl.deleteItem()
        UICtrl.deleteSingleItem(objectId)
        Storage.delete(objectId)
    }

    function backState(e) {
        e.preventDefault()
        UICtrl.clearEditState()
    }

    function deleteAll() {
        UICtrl.deleteAllItem()
        ItemCtrl.deleteAllItem()
        Storage.deleteAll()
    }

    return {
        init: function () {
            loadEventListener()
            // getting items from Itemctrl and showing it to ui 
            const items = ItemCtrl.getItems()
            UICtrl.showItems(items)
            // clear edit state when load
            UICtrl.clearEditState()
            // getting calories from Itemctrl and showing it to UI
            const totalCalories = ItemCtrl.getTotalCalories()
            UICtrl.showCalories(totalCalories)
        }
    }

})(ItemCtrl, UICtrl)

App.init()