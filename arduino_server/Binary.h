#ifndef BINARY_H_
#define BINARY_H_

#include "Control.h"

class Binary : public Control
{
public:
	// static constructors
	static Binary* create(PortManager& portManager, bool active);
	static Binary* create(PortManager& portManager, bool active, String id);
	
	// destructor
	virtual ~Binary();

	// operations
	virtual Type getType();
	virtual String getStringType() const;
	virtual void updatePort();
	virtual bool updateFrom(SmartControl* origin);
	virtual void setDefault();
	
	// getters / setters
	bool getValue();
	void setValue(bool value);
	
private:
	// constructors
	Binary(PortManager& portManager, bool active);
	Binary(PortManager& portManager, bool active, int id);
	
	// variables
	bool value;
};

#endif /* BINARY_H_ */
