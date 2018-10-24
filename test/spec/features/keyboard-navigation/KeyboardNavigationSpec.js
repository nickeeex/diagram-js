import {
  bootstrapDiagram,
  getDiagramJS,
  inject
} from 'test/TestHelper';

import { createKeyEvent } from 'test/util/KeyEvents';

import {
  assign,
  forEach
} from 'min-dash';

import modelingModule from 'lib/features/modeling';
import keyboardNavigationModule from 'lib/features/keyboard-navigation';


describe('features/keyboard-navigation', function() {

  var defaultDiagramConfig = {
    modules: [
      modelingModule,
      keyboardNavigationModule
    ],
    canvas: {
      deferUpdate: false
    }
  };

  describe('bootstrap', function() {

    beforeEach(bootstrapDiagram(defaultDiagramConfig));


    it('should bootstrap', inject(function(keyboardNavigation, canvas) {

      canvas.addShape({
        id: 'test',
        width: 100,
        height: 100,
        x: 100,
        y: 100
      });

      expect(keyboardNavigation).not.to.be.null;
    }));

  });


  describe('arrow bindings', function() {

    var KEYS = {
      LEFT: [ 'ArrowLeft', 'Left' ],
      UP: [ 'ArrowUp', 'Up' ],
      RIGHT: [ 'ArrowRight', 'Right' ],
      DOWN: [ 'ArrowDown', 'Down' ],
    };

    beforeEach(bootstrapDiagram(defaultDiagramConfig));


    describe('with default config', function() {

      describe('with Ctrl/Cmd', function() {

        it('should not move when neither Ctrl nor Cmd is pressed down',
          inject(function(canvas, keyboard) {

            // given
            var event = createKeyEvent(KEYS.RIGHT[0], { ctrlKey: false, metaKey: false });

            // when
            keyboard._keyHandler(event);

            // then
            expect(canvas.viewbox().x).to.eql(0);
            expect(canvas.viewbox().y).to.eql(0);
          })
        );

      });


      describe('with Ctrl/Cmd', function() {

        var decisionTable = [
          {
            desc: 'move left',
            keys: KEYS.LEFT,
            x: -50,
            y: 0
          },
          {
            desc: 'move right',
            keys: KEYS.RIGHT,
            x: 50,
            y: 0
          },
          {
            desc: 'move up',
            keys: KEYS.UP,
            x: 0,
            y: -50
          },
          {
            desc: 'move down',
            keys: KEYS.DOWN,
            x: 0,
            y: 50
          }
        ];
        /* eslint-enable */

        forEach(decisionTable, function(testCase) {

          forEach(testCase.keys, function(key) {

            it('should ' + testCase.desc + ' with CmdKey', inject(function(canvas, keyboard) {

              // given
              var event = createKeyEvent(key, { metaKey: true, shiftKey: false });

              // when
              keyboard._keyHandler(event);

              // then
              expect(canvas.viewbox().x).to.eql(testCase.x);
              expect(canvas.viewbox().y).to.eql(testCase.y);
            }));


            it('should ' + testCase.desc + ' with CtrlKey', inject(function(canvas, keyboard) {

              // given
              var event = createKeyEvent(key, { ctrlKey: true, shiftKey: false });

              // when
              keyboard._keyHandler(event);

              // then
              expect(canvas.viewbox().x).to.eql(testCase.x);
              expect(canvas.viewbox().y).to.eql(testCase.y);
            }));

          });

        });

      });

    });


    describe('with custom config', function() {

      it('should use custom speed', function() {

        // given
        var customConfig = {
          keyboardNavigation: {
            moveSpeed: 23
          }
        };

        bootstrapDiagram(assign({}, defaultDiagramConfig, customConfig))();

        var keyDownEvent = createKeyEvent(KEYS.DOWN[0], { ctrlKey: true });

        getDiagramJS().invoke(function(canvas, keyboard) {

          // when
          keyboard._keyHandler(keyDownEvent);

          // then
          expect(canvas.viewbox().x).to.eql(0);
          expect(canvas.viewbox().y).to.eql(23);

        });
      });


      it('should use natural scrolling if enabled', function() {

        // given
        var customConfig = {
          keyboardNavigation: {
            invertY: true
          }
        };

        bootstrapDiagram(assign({}, defaultDiagramConfig, customConfig))();

        var keyDownEvent = createKeyEvent(KEYS.DOWN[0], { ctrlKey: true }),
            keyUpEvent = createKeyEvent(KEYS.UP[0], { ctrlKey: true });

        getDiagramJS().invoke(function(canvas, keyboard) {

          // when
          keyboard._keyHandler(keyDownEvent);

          // then
          expect(canvas.viewbox().x).to.eql(0);
          expect(canvas.viewbox().y).to.eql(-50);

          // when
          keyboard._keyHandler(keyUpEvent);

          // then
          expect(canvas.viewbox().x).to.eql(0);
          expect(canvas.viewbox().y).to.eql(0);

        });

      });

    });

  });

});
