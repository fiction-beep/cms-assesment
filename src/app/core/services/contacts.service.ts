import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map, forkJoin } from 'rxjs';
import { Contact, Email, EmailAddress } from '../../shared/models/contact.model';

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
  private apiUrl = 'https://67fbd85e1f8b41c816850dc0.mockapi.io';

  // Keep the mock data as fallback in case the API fails
  private mockContacts: Contact[] = [
    {
      id: 1,
      firstName: 'Johanna',
      lastName: 'Stevens',
      jobTitle: 'UI/UX Designer',
      profileImage: 'https://previews.123rf.com/images/lytasepta/lytasepta2211/lytasepta221100259/195171454-female-avatar-profile-picture-for-social-network-with-half-turn-fashion-and-beauty-bright-vector.jpg',
      bio: 'When I first got into the advertising, I was looking for the magical combination that would put website into the top search engine rankings',
      email: [
        { address: 'johanna.stevens@gmail.com', isPrimary: true },
        { address: 'johanna.stevens@whiteui.store' }
      ],
      phone: [
        { number: '439-582-1578', isPrimary: true },
        { number: '621-770-7689' }
      ],
      meeting: 'http://go.betacall.com/meet/j.stevens',
      social: {
        facebook: 'johanna.stevens',
        twitter: 'j.stevens',
        linkedin: 'johanna-stevens',
        pinterest: 'johanna.stevens',
        google: 'j.stevens'
      },
      status: 'online'
    },
    {
      id: 2,
      firstName: 'Nicholas',
      lastName: 'Gordon',
      jobTitle: 'Frontend Developer',
      profileImage: 'https://randomuser.me/api/portraits/men/42.jpg',
      bio: 'Experienced frontend developer specializing in React and Angular frameworks with a passion for creating responsive and accessible web applications',
      email: [
        { address: 'nicholas.gordon@gmail.com', isPrimary: true },
        { address: 'nick@devteam.com' }
      ],
      phone: [
        { number: '328-456-7890', isPrimary: true },
        { number: '212-987-1234' }
      ],
      meeting: 'http://go.betacall.com/meet/n.gordon',
      social: {
        facebook: 'nicholas.gordon',
        twitter: 'nick_codes',
        linkedin: 'nicholas-gordon-dev',
        pinterest: undefined,
        google: 'nicholas.gordon'
      },
      status: 'online'
    },
    {
      id: 3,
      firstName: 'Bradley',
      lastName: 'Malone',
      jobTitle: 'Sales Manager',
      profileImage: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'Results-driven sales manager with over 10 years of experience in B2B sales and team leadership. Specializing in building client relationships and exceeding revenue targets',
      email: [
        { address: 'bradley.malone@sales.com', isPrimary: true },
        { address: 'b.malone@gmail.com' }
      ],
      phone: [
        { number: '555-123-4567', isPrimary: true }
      ],
      meeting: 'http://go.betacall.com/meet/b.malone',
      social: {
        facebook: 'bradley.malone',
        twitter: 'bradleysales',
        linkedin: 'bradley-malone-sales',
        pinterest: undefined,
        google: undefined
      },
      status: 'offline'
    },
    {
      id: 4,
      firstName: 'Marvin',
      lastName: 'Lambert',
      jobTitle: 'UI Designer',
      profileImage: 'https://randomuser.me/api/portraits/men/92.jpg',
      bio: 'Creative UI designer with a background in visual arts. Passionate about creating intuitive and beautiful interfaces that enhance user experience',
      email: [
        { address: 'marvin.design@gmail.com', isPrimary: true },
        { address: 'marvin@designstudio.com' }
      ],
      phone: [
        { number: '213-456-8901', isPrimary: true },
        { number: '213-987-6543' }
      ],
      meeting: 'http://go.betacall.com/meet/m.lambert',
      social: {
        facebook: 'marvin.lambert.design',
        twitter: 'marvindesigns',
        linkedin: 'marvin-lambert',
        pinterest: 'marvinlambert',
        google: 'marvin.lambert'
      },
      status: 'away'
    },
    {
      id: 5,
      firstName: 'Teresa',
      lastName: 'Lloyd',
      jobTitle: 'PR Specialist',
      profileImage: 'https://randomuser.me/api/portraits/women/72.jpg',
      bio: 'Public relations specialist with expertise in brand management and crisis communication. Dedicated to crafting compelling stories that resonate with diverse audiences',
      email: [
        { address: 'teresa.lloyd@prfirm.com', isPrimary: true },
        { address: 'teresa.lloyd@gmail.com' }
      ],
      phone: [
        { number: '310-555-1234', isPrimary: true }
      ],
      meeting: 'http://go.betacall.com/meet/t.lloyd',
      social: {
        facebook: 'teresa.lloyd',
        twitter: 'teresapr',
        linkedin: 'teresa-lloyd-pr',
        pinterest: 'teresalloyd',
        google: undefined
      },
      status: 'away'
    },
    {
      id: 6,
      firstName: 'Fred',
      lastName: 'Haynes',
      jobTitle: 'Support Specialist',
      profileImage: 'https://randomuser.me/api/portraits/men/52.jpg',
      bio: 'Customer-focused support specialist with a knack for solving complex technical issues. Committed to providing exceptional service and clear communication',
      email: [
        { address: 'fred.support@techdesk.com', isPrimary: true },
        { address: 'fred.haynes@gmail.com' }
      ],
      phone: [
        { number: '415-789-0123', isPrimary: true },
        { number: '415-234-5678' }
      ],
      meeting: 'http://go.betacall.com/meet/f.haynes',
      social: {
        facebook: 'fred.haynes',
        twitter: 'fredsupport',
        linkedin: 'fred-haynes',
        pinterest: undefined,
        google: 'fred.haynes'
      },
      status: 'offline'
    },
    {
      id: 7,
      firstName: 'Rose',
      lastName: 'Peters',
      jobTitle: 'Project Manager',
      profileImage: 'https://randomuser.me/api/portraits/women/42.jpg',
      bio: 'Certified project manager with a track record of delivering complex projects on time and within budget. Expert in agile methodologies and cross-functional team leadership',
      email: [
        { address: 'rose.peters@projecthub.com', isPrimary: true },
        { address: 'rose.p@gmail.com' }
      ],
      phone: [
        { number: '650-432-1098', isPrimary: true }
      ],
      meeting: 'http://go.betacall.com/meet/r.peters',
      social: {
        facebook: 'rose.peters',
        twitter: 'roseprojects',
        linkedin: 'rose-peters-pm',
        pinterest: 'rosepeters',
        google: 'rose.peters'
      },
      status: 'offline'
    },
    {
      id: 8,
      firstName: 'Brian',
      lastName: 'Watson',
      jobTitle: 'Backend Developer',
      profileImage: 'https://randomuser.me/api/portraits/men/22.jpg',
      bio: 'Backend developer specializing in scalable cloud architectures and microservices. Passionate about performance optimization and clean code principles',
      email: [
        { address: 'brian.watson@devteam.com', isPrimary: true },
        { address: 'brian.w@gmail.com' }
      ],
      phone: [
        { number: '510-876-5432', isPrimary: true },
        { number: '510-123-4567' }
      ],
      meeting: 'http://go.betacall.com/meet/b.watson',
      social: {
        facebook: 'brian.watson.dev',
        twitter: 'brianbackend',
        linkedin: 'brian-watson-dev',
        pinterest: undefined,
        google: 'brian.watson'
      },
      status: 'online'
    },
    {
      id: 9,
      firstName: 'Hettie',
      lastName: 'Richardson',
      jobTitle: 'QA Engineer',
      profileImage: 'https://randomuser.me/api/portraits/women/32.jpg',
      bio: 'Detail-oriented QA engineer with expertise in automated testing frameworks. Committed to ensuring software quality and exceptional user experiences',
      email: [
        { address: 'hettie.qa@techteam.com', isPrimary: true },
        { address: 'hettie.richardson@gmail.com' }
      ],
      phone: [
        { number: '408-765-4321', isPrimary: true },
        { number: '408-321-6789' }
      ],
      meeting: 'http://go.betacall.com/meet/h.richardson',
      social: {
        facebook: 'hettie.richardson',
        twitter: 'hettieqa',
        linkedin: 'hettie-richardson',
        pinterest: 'hettierichardson',
        google: 'hettie.richardson'
      },
      status: 'online'
    }
  ];

  constructor(private http: HttpClient) { }

  /**
   * Get all contacts
   */
  getContacts(): Observable<Contact[]> {
    return this.http.get<ApiContact[]>(`${this.apiUrl}/contacts`).pipe(
      map(apiContacts => this.transformApiContacts(apiContacts)),
      catchError(error => {
        console.error('Error fetching contacts from API:', error);
        // Fallback to mock data if API fails
        return of(this.mockContacts);
      })
    );
  }

  /**
   * Get a single contact by ID
   */
  getContactById(id: string | number): Observable<Contact | undefined> {
    return this.http.get<ApiContact>(`${this.apiUrl}/contacts/${id}`).pipe(
      map(apiContact => this.transformApiContact(apiContact)),
      catchError(error => {
        console.error(`Error fetching contact with id ${id} from API:`, error);
        // Fallback to mock data if API fails
        const numId = typeof id === 'string' ? parseInt(id) : id;
        const contact = this.mockContacts.find(c => c.id === numId);
        return of(contact);
      })
    );
  }

  /**
   * Get email addresses for a contact
   */
  getEmailAddresses(contactId: string): Observable<EmailAddress[]> {
    // Convert to EmailAddress format for compatibility with existing components
    return this.getContactEmails(contactId).pipe(
      map(emails => {
        if (!emails) return [];

        return emails.map((email, index) => ({
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
    return forkJoin({
      contact: this.getContactById(contactId),
      emails: this.getEmailAddresses(contactId)
    }).pipe(
      map(result => {
        if (!result.contact) {
          throw new Error(`Contact with ID ${contactId} not found`);
        }
        return {
          contact: result.contact,
          emails: result.emails
        };
      })
    );
  }

  /**
   * Get all contacts with their emails
   * This combines both API calls for simplified data access
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
      }),
      catchError(error => {
        console.error('Error fetching contacts with emails:', error);
        // Fallback to mock data
        const contactsWithEmails = this.mockContacts.map(contact => {
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
        return of(contactsWithEmails);
      })
    );
  }

  // Functions from the user-provided code

  /**
   * Get emails for a contact
   */
  private getContactEmails(id: string | number): Observable<Email[] | undefined> {
    // Since the API doesn't have a specific endpoint for emails,
    // we'll get them from the mock data
    const numId = typeof id === 'string' ? parseInt(id) : id;
    const mockContact = this.mockContacts.find(c => c.id === numId);

    if (mockContact && mockContact.email) {
      return of(mockContact.email);
    }

    // If no mock contact found, generate mock emails
    return this.getContactById(id).pipe(
      map(contact => {
        if (!contact) return undefined;

        // Create a work email and a personal email
        const name = contact.firstName.toLowerCase();
        const lastName = contact.lastName.toLowerCase();

        return [
          { address: `${name}.${lastName}@company.com`, isPrimary: true },
          { address: `${name}${lastName}@gmail.com` }
        ];
      }),
      catchError(error => {
        console.error(`Error generating emails for contact with id ${id}:`, error);
        return of(undefined);
      })
    );
  }

  // Transform API contacts to our Contact model
  private transformApiContacts(apiContacts: ApiContact[]): Contact[] {
    return apiContacts.map(apiContact => this.transformApiContact(apiContact));
  }

  // Transform a single API contact to our Contact model
  private transformApiContact(apiContact: ApiContact): Contact {
    // Split the name into first and last name
    const nameParts = apiContact.name.split(' ');
    const firstName = nameParts[0];
    // The last name could be multiple words (especially for names with titles like "Dr.")
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    // Generate a job title based on the id (just for demonstration)
    const jobTitles = ['Customer Service Rep', 'Sales Manager', 'Support Specialist', 'Account Manager', 'Team Lead'];
    const jobTitle = jobTitles[Number(apiContact.id) % jobTitles.length];

    return {
      id: Number(apiContact.id),
      firstName,
      lastName,
      jobTitle,
      profileImage: apiContact.avatar,
      bio: `Contact profile for ${apiContact.name}, created on ${new Date(apiContact.createdAt).toLocaleDateString()}.`,
      status: this.getRandomStatus()
    };
  }

  // Generate a random status for demonstration
  private getRandomStatus(): 'online' | 'offline' | 'away' {
    const statuses: ('online' | 'offline' | 'away')[] = ['online', 'offline', 'away'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }
}
