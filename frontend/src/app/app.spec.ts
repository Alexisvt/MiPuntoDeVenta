import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('shows when the backend is available and keeps the non-fiscal boundary visible', async () => {
    const fixture = TestBed.createComponent(App);
    const http = TestBed.inject(HttpTestingController);
    http.expectOne('/api/v1/health').flush({ status: 'UP' });
    await fixture.whenStable();
    fixture.detectChanges();
    const content = fixture.nativeElement.textContent as string;
    expect(content).toContain('Sistema disponible');
    expect(content).toContain('Recibos internos no fiscales');
    http.verify();
  });
});
