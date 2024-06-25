let cart = []
let modalQt = 1
let modalKey = 0

const updateCart = () => {
    document.querySelector('.menu-openner span').textContent = cart.length

    if (cart.length > 0) {
        document.querySelector('aside').classList.add('show')
        document.querySelector('.cart').innerHTML = ``

        let subTotal = 0
        let discount = 0
        let total = 0

        for (let i in cart) {
            const pizzaItem = pizzaJson.find((item) => item.id == cart[i].id)
            subTotal += pizzaItem.price * cart[i].qt
            const cartItem = document.querySelector('.models .cart--item').cloneNode(true)
            let pizzaSizeName
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = `P`
                    break
                case 1:
                    pizzaSizeName = `M`
                    break
                case 2:
                    pizzaSizeName = `G`
                    break
            }

            const pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').textContent = pizzaName
            cartItem.querySelector('.cart--item--qt').textContent = cart[i].qt
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--
                } else {
                    cart.splice(i, 1)
                }
                updateCart()
            })
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++
                updateCart()
            })

            document.querySelector('.cart').append(cartItem)
        }
        discount = subTotal * 0.1
        total = subTotal - discount

        document.querySelector('.subtotal span:last-child').textContent = `${subTotal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`
        document.querySelector('.desconto span:last-child').textContent = `${discount.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`
        document.querySelector('.total span:last-child').textContent = `${total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`
    } else {
        document.querySelector('aside').classList.remove('show')
        document.querySelector('aside').style.left = `100vw`
    }
}

// PIZZA LIST
pizzaJson.map((item, index) => {
    const pizzaItem = document.querySelector('.pizza-item').cloneNode(true)

    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--price').textContent = item.price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
    pizzaItem.querySelector('.pizza-item--name').textContent = item.name
    pizzaItem.querySelector('.pizza-item--desc').textContent = item.description

    pizzaItem.querySelector('.pizza-item a').addEventListener('click', (event) => {
        event.preventDefault()
        const key = event.target.closest('.pizza-item').getAttribute('data-key')
        modalQt = 1
        modalKey = key

        document.querySelector('.pizzaBig img').src = pizzaJson[key].img
        document.querySelector('.pizzaInfo h1').textContent = pizzaJson[key].name
        document.querySelector('.pizzaInfo--desc').textContent = pizzaJson[key].description
        document.querySelector('.pizzaInfo--actualPrice').textContent = pizzaJson[key].price.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected')
        document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected')
            }
            size.querySelector('span').textContent = pizzaJson[key].sizes[sizeIndex]
        })
        document.querySelector('.pizzaInfo--qt').textContent = modalQt

        document.querySelector('.pizzaWindowArea').style.opacity = 0
        setTimeout(() => {
            document.querySelector('.pizzaWindowArea').style.opacity = 1
        }, 200)
        document.querySelector('.pizzaWindowArea').style.display = `flex`
    })

    document.querySelector('.pizza-area').append(pizzaItem)
})

// MODAL EVENTS
const closeModal = () => {
    document.querySelector('.pizzaWindowArea').style.opacity = 0
    setTimeout(() => {
        document.querySelector('.pizzaWindowArea').style.display = `none`
    }, 500)
}

document.querySelectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal)
})

document.querySelector('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--
        document.querySelector('.pizzaInfo--qt').textContent = modalQt
    }
})

document.querySelector('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++
    document.querySelector('.pizzaInfo--qt').textContent = modalQt
})

document.querySelectorAll('.pizzaInfo--size').forEach((size) => {
    size.addEventListener('click', () => {
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected')
    })
})

document.querySelector('.pizzaInfo--addButton').addEventListener('click', () => {
    const size = parseInt(document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key'))
    const identifier = `${pizzaJson[modalKey].id}@${size}`
    const key = cart.findIndex((item) => item.identifier == identifier)

    if (key > -1) {
        cart[key].qt += modalQt
    } else {
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        })
    }
    updateCart()
    closeModal()
})

// MOBILE CART EVENT

document.querySelector('.menu-openner span').addEventListener('click', () => {
    if (cart.length > 0) {
        document.querySelector('aside').style.left = 0
    }
})

document.querySelector('.menu-closer').addEventListener('click', () => {
    document.querySelector('aside').style.left = `100vw`
})