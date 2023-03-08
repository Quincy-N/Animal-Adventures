const selectionContainer = document.getElementsByClassName('buttons-container');
const modal = document.querySelector('.modal');
const modalExit = document.querySelector('.modal-exit');
const checkoutButton = document.querySelector('#checkout');
for (const container of selectionContainer) {
    let increase = container.querySelector('.increase');
    let decrease = container.querySelector('.decrease');
    let amount = container.querySelector('.ticket-amount');
    increase.addEventListener('click', () => {
        let newAmount = Number(amount.getAttribute('value')) + 1;
        if (newAmount <= amount.getAttribute('max')) {
            amount.setAttribute('value', newAmount);
        } else {
            alert('Limit reached. Please contact us for further assistance.');
        }
    });
    decrease.addEventListener('click', () => {
        let newAmount = Number(amount.getAttribute('value')) - 1;
        if (newAmount >= 0) {
            amount.setAttribute('value', newAmount);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        modal.showModal();
    }, 2000);
});

modalExit.addEventListener('click', () => {
    modal.close();
})

checkoutButton.addEventListener('click', () => {
    alert('Tickets cannot be purchased at the moment.');
});