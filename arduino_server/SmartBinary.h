#ifndef SMART_BINARY_H_
#define SMART_BINARY_H_

#include "SmartControl.h"

class SmartBinary : public SmartControl
{
public:
	// static constructors
	static SmartBinary* create(String id);
	static SmartBinary* copy(SmartBinary* origin);
	
	// destructor
	virtual ~SmartBinary();

	// operations
	virtual Control::Type getType();
	virtual String getStringType() const;
	
	// getters / setters
	bool getValue();
	void setValue(bool value);
	
private:
	// constructors
	SmartBinary(String id);
	SmartBinary(SmartBinary* origin);
	
	// variables
	bool value;
};

#endif /* SMART_BINARY_H_ */
