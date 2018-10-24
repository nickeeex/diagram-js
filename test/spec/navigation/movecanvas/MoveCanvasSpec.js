import {
  bootstrapDiagram,
  inject
} from 'test/TestHelper';

import interactionEventsModule from 'lib/features/interaction-events';
import moveCanvasModule from 'lib/navigation/movecanvas';


describe('navigation/movecanvas', function() {

  var defaultDiagramConfig = {
    modules: [
      interactionEventsModule,
      moveCanvasModule
    ],
    canvas: {
      deferUpdate: false
    }
  };

  describe('bootstrap', function() {

    beforeEach(bootstrapDiagram(defaultDiagramConfig));


    it('should bootstrap', inject(function(moveCanvas, canvas) {

      canvas.addShape({
        id: 'test',
        width: 100,
        height: 100,
        x: 100,
        y: 100
      });

      expect(moveCanvas).not.to.be.null;
    }));

  });


  describe('integration', function() {

    beforeEach(bootstrapDiagram(defaultDiagramConfig));


    it('should silence click', inject(function(eventBus, canvas) {

      canvas.addShape({
        id: 'test',
        width: 100,
        height: 100,
        x: 100,
        y: 100
      });

      // click should not be triggered on
      // canvas drag
      eventBus.on('element.click', function(error) {
        expect(error).to.not.exist;
      });
    }));

  });

});
