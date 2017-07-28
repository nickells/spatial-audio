function initHelp() {
  const modal = document.getElementById('help-modal')
  document.getElementById('help').addEventListener('click', ()=>{
    modal.classList.add('active')
  })

  document.getElementsByClassName('scrim')[0].addEventListener('click', ()=>{
    modal.classList.remove('active')
  })
}

module.exports = initHelp
