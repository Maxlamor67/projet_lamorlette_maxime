// Récupération des éléments du DOM dont on aura besoin
const form = document.getElementById('signup-form');
const errorMessage = document.getElementById('error-message');
const formContainer = document.getElementById('form-container');
const recapContainer = document.getElementById('recap-container');
const recapList = document.getElementById('recap-list');

// On écoute la soumission du formulaire
form.addEventListener('submit', function (event) {
  // On empêche le rechargement de la page
  event.preventDefault();

  // On efface l'ancien message d'erreur
  errorMessage.textContent = '';

  // Récupération des valeurs saisies
  const login = document.getElementById('login').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const nom = document.getElementById('nom').value.trim();
  const prenom = document.getElementById('prenom').value.trim();
  const adresse = document.getElementById('adresse').value.trim();
  const email = document.getElementById('email').value.trim();
  const telephone = document.getElementById('telephone').value.trim();
  const dateNaissance = document.getElementById('date-naissance').value;

  // 1) Vérifier que tous les champs sont remplis
  if (!login || !password || !confirmPassword || !nom || !prenom ||
      !adresse || !email || !telephone || !dateNaissance) {
    errorMessage.textContent = 'Veuillez remplir tous les champs.';
    return;
  }

  // 2) Vérifier que l'email est valide (expression régulière simple)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorMessage.textContent = "L'adresse email n'est pas valide.";
    return;
  }

  // 3) Vérifier que le mot de passe et la confirmation correspondent
  if (password !== confirmPassword) {
    errorMessage.textContent = 'Les mots de passe ne correspondent pas.';
    return;
  }

  // Si tout est correct : on construit le récapitulatif
  // (on n'affiche pas le mot de passe, comme demandé)
  const infos = [
    { label: 'Login', valeur: login },
    { label: 'Nom', valeur: nom },
    { label: 'Prénom', valeur: prenom },
    { label: 'Adresse', valeur: adresse },
    { label: 'Email', valeur: email },
    { label: 'Téléphone', valeur: telephone },
    { label: 'Date de naissance', valeur: dateNaissance }
  ];

  // On vide la liste au cas où (utile si l'utilisateur revient en arrière)
  recapList.innerHTML = '';

  infos.forEach(function (info) {
    const li = document.createElement('li');
    li.textContent = info.label + ' : ' + info.valeur;
    recapList.appendChild(li);
  });

  // On masque le formulaire et on affiche le récapitulatif
  formContainer.classList.add('hidden');
  recapContainer.classList.remove('hidden');
});