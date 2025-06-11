import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToMakeQuizComponent } from './how-to-make-quiz.component';

describe('HowToMakeQuizComponent', () => {
  let component: HowToMakeQuizComponent;
  let fixture: ComponentFixture<HowToMakeQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowToMakeQuizComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HowToMakeQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
