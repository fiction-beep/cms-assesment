import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, BehaviorSubject, tap, firstValueFrom } from 'rxjs';
import { Contact, Email, EmailAddress } from '../../shared/models/contact.model';
import { API_CONFIG } from '../config/api-config';

interface ApiContact {
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  /**
 * Notes on current implementation and potential improvements:
 *
 * - **Data Fetching**: Utilizes MockAPI.io for generating mock user data, limited to a single endpoint. Data is fetched in `ngOnInit` and stored locally. When a user is selected, details are retrieved from this stored data.
 * - **Optimization Opportunities**:
 *   - **State Management**: Implement a state management library like NgRx to centralize data handling and improve scalability. Alternatively, leverage Angular Signals for enhanced reactivity and simpler state updates.
 *   - **File/Folder Structure**: Restructure to include a dedicated utilities module for reusable functions, improving maintainability and reducing code duplication.
 * - **Future Enhancements**:
 *   - **Multiple Endpoints**: Support additional endpoints to fetch specific user details dynamically, reducing reliance on a single data source.
 *   - **Data Interaction**: Add features like sorting, real/virtual scrolling, and pagination to enhance user experience and performance when viewing large datasets.
 *
 * These improvements would enhance performance, scalability, and user interaction within the Angular application.
 */
  private apiUrl = API_CONFIG.BASE_URL;
  private contactsEndpoint = API_CONFIG.ENDPOINTS.CONTACTS;
  private contactsSubject = new BehaviorSubject<Contact[]>([]);
  private contactsLoaded = false;

  constructor(private http: HttpClient) { }

  /**
   * Initialize contacts data by loading from API
   */
  initializeContacts(): Promise<Contact[]> {
    if (this.contactsLoaded) {
      return firstValueFrom(this.contactsSubject.asObservable());
    }

    return firstValueFrom(
      this.http.get<ApiContact[]>(`${this.apiUrl}${this.contactsEndpoint}`).pipe(
        map(apiContacts => this.transformApiContacts(apiContacts)),
        tap(contacts => {
          this.contactsLoaded = true;
          this.contactsSubject.next(contacts);
        }),
        catchError(error => {
          console.error('Error fetching contacts:', error);
          return of([]);
        })
      )
    );
  }

  /**
   * Get all contacts - first from cache, then from API if not loaded
   */
  getContacts(): Observable<Contact[]> {
    // If contacts are already loaded, return from BehaviorSubject
    if (this.contactsLoaded) {
      return this.contactsSubject.asObservable();
    }

    // Otherwise load from API
    this.http.get<ApiContact[]>(`${this.apiUrl}${this.contactsEndpoint}`).pipe(
      map(apiContacts => this.transformApiContacts(apiContacts)),
      catchError(error => {
        console.error('Error fetching contacts:', error);
        return of([]);
      })
    ).subscribe(contacts => {
      this.contactsLoaded = true;
      this.contactsSubject.next(contacts);
    });

    return this.contactsSubject.asObservable();
  }

  /**
   * Get a single contact by ID from the contacts list
   */
  getContactById(id: string | number): Observable<Contact | undefined> {
    return this.contactsSubject.pipe(
      map(contacts => contacts.find(contact =>
        contact.id === (typeof id === 'string' ? parseInt(id) : id)
      ))
    );
  }

  /**
   * Get contact by ID from the API
   * Note: This is used for direct API calls when needed
   */
  getContactByIdFromApi(id: string | number): Observable<Contact | undefined> {
    return this.http.get<ApiContact>(`${this.apiUrl}${this.contactsEndpoint}/${id}`).pipe(
      map(apiContact => this.transformApiContact(apiContact)),
      catchError(error => {
        console.error(`Error fetching contact with id ${id}:`, error);
        return of(undefined);
      })
    );
  }

  /**
   * Get email addresses for a contact
   */
  getEmailAddresses(contactId: string): Observable<EmailAddress[]> {
    return this.getContactById(contactId).pipe(
      map(contact => {
        if (!contact || !contact.email) return [];

        return contact.email.map((email, index) => ({
          id: `${index + 1}`,
          email: email.address,
          isPrimary: email.isPrimary || false,
          contactId
        }));
      })
    );
  }

  /**
   * Get contact with email addresses
   */
  getContactWithEmails(contactId: string): Observable<{contact: Contact, emails: EmailAddress[]}> {
    return this.getContactById(contactId).pipe(
      map(contact => {
        if (!contact) {
          throw new Error(`Contact with ID ${contactId} not found`);
        }

        const emails: EmailAddress[] = contact.email ? contact.email.map((email, index) => ({
          id: `${index + 1}`,
          email: email.address,
          isPrimary: email.isPrimary || false,
          contactId: contact.id.toString()
        })) : [];

        return {
          contact,
          emails
        };
      }),
      catchError(error => {
        console.error(`Error getting contact with emails for id ${contactId}:`, error);
        return of({
          contact: this.createEmptyContact(),
          emails: []
        });
      })
    );
  }

  /**
   * Get all contacts with their emails
   */
  getContactsWithEmails(): Observable<{contact: Contact, emails: EmailAddress[]}[]> {
    return this.getContacts().pipe(
      map(contacts => {
        return contacts.map(contact => {
          let emailAddresses: EmailAddress[] = [];
          if (contact.email) {
            emailAddresses = contact.email.map((email, index) => ({
              id: `${index + 1}`,
              email: email.address,
              isPrimary: email.isPrimary || false,
              contactId: contact.id.toString()
            }));
          }
          return {
            contact,
            emails: emailAddresses
          };
        });
      })
    );
  }

  /**
   * Transform API contacts to our Contact model
   */
  private transformApiContacts(apiContacts: ApiContact[]): Contact[] {
    if (!apiContacts || !Array.isArray(apiContacts)) {
      console.warn('Invalid API contacts data:', apiContacts);
      return [];
    }
    return apiContacts.map(apiContact => this.transformApiContact(apiContact));
  }

  /**
   * Transform a single API contact to our Contact model
   */
  private transformApiContact(apiContact: ApiContact): Contact {
    if (!apiContact) {
      console.warn('Invalid API contact data:', apiContact);
      return this.createEmptyContact();
    }

    try {
      const nameParts = apiContact.name ? apiContact.name.split(' ') : ['Unknown', 'User'];
      const firstName = nameParts[0] || 'Unknown';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : 'User';
      const id = apiContact.id ? parseInt(apiContact.id) : Math.floor(Math.random() * 1000);

      return {
        id: id,
        firstName: firstName,
        lastName: lastName,
        jobTitle: this.getRandomJobTitle(),
        profileImage: apiContact.avatar || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${id % 100}.jpg`,
        bio: `Bio information for ${firstName} ${lastName}. Joined on ${new Date(apiContact.createdAt || new Date()).toLocaleDateString()}.`,
        email: [
          { address: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`, isPrimary: true },
          { address: `${firstName.toLowerCase()}@company.com` }
        ],
        phone: [
          { number: this.generateRandomPhoneNumber(), isPrimary: true },
          { number: this.generateRandomPhoneNumber() }
        ],
        meeting: `http://go.betacall.com/meet/${firstName.charAt(0).toLowerCase()}.${lastName.toLowerCase()}`,
        social: {
          facebook: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
          twitter: `${firstName.charAt(0).toLowerCase()}${lastName.toLowerCase()}`,
          linkedin: `${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
          pinterest: Math.random() > 0.5 ? `${firstName.toLowerCase()}${lastName.toLowerCase()}` : undefined,
          google: Math.random() > 0.5 ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}` : undefined
        },
        status: this.getRandomStatus()
      };
    } catch (error) {
      console.error('Error transforming API contact:', error);
      return this.createEmptyContact();
    }
  }

  /**
   * Create an empty contact for fallback
   */
  private createEmptyContact(): Contact {
    return {
      id: 0,
      firstName: 'Unknown',
      lastName: 'User',
      jobTitle: 'User',
      profileImage: 'https://randomuser.me/api/portraits/lego/1.jpg',
      bio: 'No information available',
      email: [{ address: 'unknown@example.com', isPrimary: true }],
      phone: [{ number: '000-000-0000', isPrimary: true }],
      meeting: 'http://example.com/meet',
      social: {
        facebook: undefined,
        twitter: undefined,
        linkedin: undefined,
        pinterest: undefined,
        google: undefined
      },
      status: 'offline'
    };
  }

  /**
   * Generate a random phone number
   */
  private generateRandomPhoneNumber(): string {
    const area = Math.floor(Math.random() * 900) + 100;
    const prefix = Math.floor(Math.random() * 900) + 100;
    const line = Math.floor(Math.random() * 9000) + 1000;
    return `${area}-${prefix}-${line}`;
  }

  /**
   * Generate a random job title
   */
  private getRandomJobTitle(): string {
    const titles = [
      'Software Developer',
      'Product Manager',
      'UI/UX Designer',
      'QA Engineer',
      'Marketing Specialist',
      'Sales Representative',
      'Customer Support',
      'Project Manager',
      'Data Analyst',
      'Team Lead'
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  }

  /**
   * Generate a random online status
   */
  private getRandomStatus(): 'online' | 'offline' | 'away' {
    const statuses: ('online' | 'offline' | 'away')[] = ['online', 'offline', 'away'];
    const randomIndex = Math.floor(Math.random() * statuses.length);
    return statuses[randomIndex];
  }
}
