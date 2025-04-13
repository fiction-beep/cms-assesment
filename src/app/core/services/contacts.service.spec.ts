import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ContactsService } from './contacts.service';
import { Contact, EmailAddress } from '../../shared/models/contact.model';

describe('ContactsService', () => {
  let service: ContactsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactsService]
    });
    service = TestBed.inject(ContactsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all contacts', () => {
    const mockContacts: Contact[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        jobTitle: 'Developer',
        status: 'online'
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        jobTitle: 'Designer',
        status: 'offline'
      }
    ];

    service.getContacts().subscribe(contacts => {
      expect(contacts.length).toBe(2);
      expect(contacts).toEqual(mockContacts);
    });

    const req = httpMock.expectOne(`${(service as any).apiUrl}/contacts`);
    expect(req.request.method).toBe('GET');
    req.flush(mockContacts);
  });

  it('should retrieve email addresses for a contact', () => {
    const contactId = '1';
    const mockEmails: EmailAddress[] = [
      {
        id: '1',
        email: 'john.doe@example.com',
        isPrimary: true,
        contactId: '1'
      },
      {
        id: '2',
        email: 'john.work@example.com',
        isPrimary: false,
        contactId: '1'
      }
    ];

    service.getEmailAddresses(contactId).subscribe(emails => {
      expect(emails.length).toBe(2);
      expect(emails).toEqual(mockEmails);
    });

    const req = httpMock.expectOne(`${(service as any).apiUrl}/contacts/${contactId}/email_addresses`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEmails);
  });

  it('should retrieve a contact with emails', () => {
    const contactId = '1';
    const mockContact: Contact = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      jobTitle: 'Developer',
      status: 'online'
    };

    const mockEmails: EmailAddress[] = [
      {
        id: '1',
        email: 'john.doe@example.com',
        isPrimary: true,
        contactId: '1'
      }
    ];

    service.getContactWithEmails(contactId).subscribe(result => {
      expect(result.contact).toEqual(mockContact);
      expect(result.emails).toEqual(mockEmails);
    });

    const contactReq = httpMock.expectOne(`${(service as any).apiUrl}/contacts/${contactId}`);
    expect(contactReq.request.method).toBe('GET');
    contactReq.flush(mockContact);

    const emailsReq = httpMock.expectOne(`${(service as any).apiUrl}/contacts/${contactId}/email_addresses`);
    expect(emailsReq.request.method).toBe('GET');
    emailsReq.flush(mockEmails);
  });
});
