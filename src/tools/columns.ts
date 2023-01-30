export const columns: {id: string, name: string, type: string, required: boolean}[] = [
    { id: 'agence', name: 'Agence', type: 'text', required: true },
    { id: 'dateFacture', name: 'Date Facture', type: 'date', required: true },
    { id: 'numeroFacture', name: 'N°Facture', type: 'text', required: true },
    { id: 'dateReception', name: 'Date Réception', type: 'date', required: true },
    { id: 'montantHT', name: 'Montant HT', type: 'number', required: true },
    { id: 'TVA', name: 'T.V.A', type: 'number', required: true },
    { id: 'montantRist', name: 'Montant Rist', type: 'number', required: true },
    { id: 'montantNet', name: 'Montant Net', type: 'number', required: true },
    { id: 'montantBrut', name: 'Montant Brut', type: 'number', required: true },
    { id: 'SHP', name: 'Shp', type: 'number', required: true },
    { id: 'montantPPA', name: 'Montant PPA', type: 'number', required: true },
    { id: 'fournisseurs', name: 'FOURNISSEURS', type: 'text', required: true },
    { id: 'bordreauxNumber', name: ' BORDREAUX N°', type: 'text', required: false },
    { id: 'marge', name: 'MARGE', type: 'number', required: true},
    { id: 'echeance', name: 'ECHEANCE', type: 'date', required: false }
  ];

export const formOptions: {id: string, name: string, type: string, required: boolean}[] = [
    { id: 'agence', name: 'Agence', type: 'text', required: true },
    { id: 'dateFacture', name: 'Date Facture', type: 'date', required: true },
    { id: 'numeroFacture', name: 'N°Facture', type: 'text', required: true },
    { id: 'dateReception', name: 'Date Réception', type: 'date', required: true },
    { id: 'montantHT', name: 'Montant HT', type: 'number', required: true },
    { id: 'TVA', name: 'T.V.A', type: 'number', required: true },
    { id: 'montantRist', name: 'Montant Rist', type: 'number', required: true },
    { id: 'montantBrut', name: 'Montant Brut', type: 'number', required: true },
    { id: 'SHP', name: 'Shp', type: 'number', required: true },
    { id: 'fournisseurs', name: 'FOURNISSEURS', type: 'text', required: true },
    { id: 'bordreauxNumber', name: ' BORDREAUX N°', type: 'text', required: false }
  ];