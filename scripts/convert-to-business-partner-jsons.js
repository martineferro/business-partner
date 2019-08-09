const Supplier = require('./Supplier.json');
const SupplierAddress = require('./SupplierAddress.json');
const SupplierContact = require('./SupplierContact.json');
const SupplierBankAccount = require('./SupplierBankAccount.json');
const SupplierCapability = require('./Capability.json');
const SupplierVisibility = require('./SupplierVisibility.json');
const Supplier2User = require('./Supplier2User.json');
const Customer = require('./Customer.json');
const CustomerAddress = require('./CustomerAddress.json');
const CustomerContact = require('./CustomerContact.json');
const CustomerBankAccount = require('./CustomerBankAccount.json');
const CustomerCapability = require('./CustomerCapability.json');

_fs = require('fs');

function run()
{
  let BusinessPartner = [];
  let BusinessPartnerAddress = [];
  let BusinessPartnerContact = [];
  let BusinessPartnerBankAccount = [];
  let BusinessPartnerCapability = [];
  let BusinessPartnerVisibility = [];
  let BusinessPartner2User = [];

  for (const sup of Supplier) {
    BusinessPartner.push({
      id: sup.ID,
      name: sup.Name,
      foundedOn: handleNull(sup.FoundedOn),
      legalForm: handleNull(sup.LegalForm),
      cityOfRegistration: sup.CityOfRegistration,
      countryOfRegistration: sup.CountryOfRegistration,
      taxIdentificationNo: handleNull(sup.TaxIdentificationNo),
      vatIdentificationNo: handleNull(sup.VatIdentificationNo),
      globalLocationNo: handleNull(sup.GlobalLocationNo),
      homePage: handleNull(sup.HomePage),
      dunsNo: handleNull(sup.DUNSNo),
      statusId: handleNull(sup.Status),
      changedBy: handleNull(sup.ChangedBy),
      createdBy: sup.CreatedBy,
      createdOn: sup.CreatedOn,
      changedOn: handleNull(sup.ChangedOn),
      noVatReason: handleNull(sup.NoVatReason),
      currencyId: handleNull(sup.CurrencyId),
      parentId: handleNull(sup.ParentId),
      hierarchyId: handleNull(sup.HierarchyId),
      entityCode: handleNull(sup.SubEntityCode),
      ovtNo: handleNull(sup.OVTNo),
      managed: sup.managed,
      isSupplier: true
    });
  }

  for (const cus of Customer) {
    BusinessPartner.push({
      id: cus._id,
      name: cus.name,
      legalForm: handleNull(cus.legalForm),
      commercialRegisterNo: handleNull(cus.commercialRegisterNo),
      cityOfRegistration: cus.cityOfRegistration,
      countryOfRegistration: cus.countryOfRegistration,
      taxIdentificationNo: handleNull(cus.taxIdentificationNo),
      vatIdentificationNo: handleNull(cus.vatIdentificationNo),
      globalLocationNo: handleNull(cus.globalLocationNo),
      homePage: handleNull(cus.homePage),
      dunsNo: handleNull(cus.dunsNo),
      statusId: handleNull(cus.status),
      createdBy: cus.createdBy,
      changedBy: handleNull(cus.changedBy),
      createdOn: cus.createdOn,
      changedOn: handleNull(cus.changedOn),
      parentId: handleNull(cus.parentId),
      hierarchyId: handleNull(cus.hierarchyId),
      entityCode: handleNull(cus.subEntityCode),
      ovtNo: handleNull(cus.ovtNo),
      currencyId: handleNull(cus.currencyId),
      managed: cus.managed,
      isCustomer: true
    })
  }

  for (const address of SupplierAddress) {

    BusinessPartnerAddress.push({
      businessPartnerId: address.SupplierID,
      type: address.Type,
      name: address.Name,
      street1: address.Street1,
      street2: handleNull(address.Street2),
      street3: handleNull(address.Street3),
      zipCode: handleNull(address.ZipCode),
      city: address.City,
      poboxZipCode: handleNull(address.POBoxZipCode),
      pobox: handleNull(address.POBox),
      areaCode: handleNull(address.AreaCode),
      state: handleNull(address.State),
      countryId: address.CountryID,
      phoneNo: handleNull(address.PhoneNo),
      faxNo: handleNull(address.FaxNo),
      email: handleNull(address.EMail),
      corporateURL: handleNull(address.CorporateURL),
      numOfEmployees: handleNull(address.NumOfEmployees),
      changedBy: handleNull(address.ChangedBy),
      createdBy: address.CreatedBy,
      createdOn: address.CreatedOn,
      changedOn: handleNull(address.ChangedOn)
    });
  }

  for (const address of CustomerAddress) {
    let { _id, customerId, ...attributes } = address;
    Object.keys(attributes).forEach(field => attributes[field] = handleNull(attributes[field]));
    attributes.businessPartnerId = customerId;

    BusinessPartnerAddress.push(attributes);
  }

  for (const contact of SupplierContact) {
    BusinessPartnerContact.push({
      businessPartnerId: contact.SupplierId,
      title: handleNull(contact.Title),
      type: contact.ContactType.toLowerCase(),
      firstName: contact.FirstName,
      lastName: contact.LastName,
      email: contact.Email,
      phone: handleNull(contact.Phone),
      mobile: handleNull(contact.Mobile),
      department: handleNull(contact.Department) && contact.Department.toLowerCase(),
      fax: handleNull(contact.Fax),
      isLinkedToUser: contact.IsLinkedToUser,
      changedBy: handleNull(contact.ChangedBy),
      createdBy: contact.CreatedBy,
      createdOn: contact.CreatedOn,
      changedOn: handleNull(contact.ChangedOn)
    });
  }

  for (const contact of CustomerContact) {
    let { _id, customerId, contactType, department, ...attributes } = contact;
    Object.keys(attributes).forEach(field => attributes[field] = handleNull(attributes[field]));
    attributes.businessPartnerId = customerId;
    attributes.type = contactType.toLowerCase();
    attributes.department = attributes.department && attributes.department.toLowerCase();

    BusinessPartnerContact.push(attributes);
  }

  for (const account of SupplierBankAccount) {
    BusinessPartnerBankAccount.push({
      businessPartnerId: account.SupplierID,
      bankName: handleNull(account.BankName),
      accountNumber: account.AccountNumber,
      bankIdentificationCode: handleNull(account.BankIdentificationCode),
      bankCountryKey: handleNull(account.BankCountryKey),
      bankCode: handleNull(account.BankCode),
      bankgiro: handleNull(account.Bankgiro),
      plusgiro: handleNull(account.Plusgiro),
      isrNumber: handleNull(account.ISRNumber),
      extBankControlKey: handleNull(account.ExtBankControlKey),
      createdBy: account.CreatedBy,
      changedBy: handleNull(account.ChangedBy),
      createdOn: account.CreatedOn,
      changedOn: handleNull(account.ChangedOn)
    });
  }

  for (const account of CustomerBankAccount) {
    let { _id, customerId, ...attributes } = account;
    Object.keys(attributes).forEach(field => attributes[field] = handleNull(attributes[field]));
    attributes.businessPartnerId = customerId;

    BusinessPartnerBankAccount.push(attributes);
  }

  for (const capability of SupplierCapability) {
    let { _id, supplierId, ...attributes } = capability;
    Object.keys(attributes).forEach(field => attributes[field] = handleNull(attributes[field]));
    attributes.businessPartnerId = supplierId;
    attributes.createdBy = 'ocadmin';

    BusinessPartnerCapability.push(attributes);
  }

  for (const capability of CustomerCapability) {
    let { _id, customerId, ...attributes } = capability;
    Object.keys(attributes).forEach(field => attributes[field] = handleNull(attributes[field]));
    attributes.businessPartnerId = customerId;

    BusinessPartnerCapability.push(attributes);
  }

  for (const visibility of SupplierVisibility) {
    let { _id, supplierId, ...attributes } = visibility;
    Object.keys(attributes).forEach(field => attributes[field] = handleNull(attributes[field]));
    attributes.businessPartnerId = supplierId;
    attributes.createdBy = attributes.createdBy || 'ocadmin';

    BusinessPartnerVisibility.push(attributes);
  }

  for (const sup2user of Supplier2User) {
    let { ID, supplierId, ...attributes } = sup2user;
    Object.keys(attributes).forEach(field => attributes[field] = handleNull(attributes[field]));
    attributes.businessPartnerId = supplierId;
    attributes.createdBy = attributes.createdBy || 'ocadmin';

    BusinessPartner2User.push(attributes);
  }

  _fs.writeFileSync('BusinessPartner.json', JSON.stringify(BusinessPartner, undefined, 2));
  _fs.writeFileSync('BusinessPartnerAddress.json', JSON.stringify(BusinessPartnerAddress, undefined, 2));
  _fs.writeFileSync('BusinessPartnerContact.json', JSON.stringify(BusinessPartnerContact, undefined, 2));
  _fs.writeFileSync('BusinessPartnerBankAccount.json', JSON.stringify(BusinessPartnerBankAccount, undefined, 2));
  _fs.writeFileSync('BusinessPartnerCapability.json', JSON.stringify(BusinessPartnerCapability, undefined, 2));
  _fs.writeFileSync('BusinessPartnerVisibility.json', JSON.stringify(BusinessPartnerVisibility, undefined, 2));
  _fs.writeFileSync('BusinessPartner2User.json', JSON.stringify(BusinessPartner2User, undefined, 2));
};

function handleNull(value)
{
  if (value === 'NULL') return null;

  return value;
};

(() => run())();
