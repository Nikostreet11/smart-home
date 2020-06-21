#ifndef BINARY_H_
#define BINARY_H_

#include "Control.h"

class Binary : public Control
{
public:
	// static constructors
	static Binary* create(PortManager& portManager);
	static Binary* create(PortManager& portManager, String id);
	
	// destructor
	virtual ~Binary();

	// operations
	virtual Type getType();
	virtual String getStringType() const;
	virtual void updatePort();
	
	// getters / setters
	bool getValue();
	void setValue(bool value);
	
private:
	// constructors
	Binary(PortManager& portManager);
	Binary(PortManager& portManager, int id);
	
	// variables
	bool value;
};

#endif /* BINARY_H_ */
