import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';

//animates transition between pages (only in chrome and firefox)
export const routerTransition = trigger('routerTransition', [
    transition('list => details, list => edit', [
    /* order */
    /* 1 */ query(':enter, :leave', style({ position: 'fixed', width: '100%' })
            , { optional: true }),
    /* 2 */ group([  // block executes in parallel
            query(':enter', [
                style({ transform: 'translateX(100%)' }),
                animate('0.4s ease-in-out', style({ transform: 'translateX(0%)' }))
            ], { optional: true }),
            query(':leave', [
                style({ transform: 'translateX(0%)' }),
                animate('0.4s ease-in-out', style({ transform: 'translateX(-100%)' }))
      ], { optional: true }),
        ])
    ]),
    transition('details => list, edit => list', [
    /* order */
    /* 1 */ query(':enter, :leave', style({ position: 'fixed', width: '100%' })
            , { optional: true }),
    /* 2 */ group([  // block executes in parallel
            query(':enter', [
                style({ transform: 'translateX(-100%)' }),
                animate('0.4s ease-in-out', style({ transform: 'translateX(0%)' }))
            ], { optional: true }),
            query(':leave', [
                style({ transform: 'translateX(0%)' }),
                animate('0.4s ease-in-out', style({ transform: 'translateX(100%)' }))
            ], { optional: true }),
        ])
    ])
])